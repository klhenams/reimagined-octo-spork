import uuid

from basicauth import encode

import requests

from pycomms_pay.payment_package.config import SUBSCRIPTION_KEY, USER_ID, API_KEY

# config.py
API_BASE_URL = "https://sandbox.momodeveloper.mtn.com"


class Momo:
    """
        A class to interact with the MTN MoMo API for sending money, checking balance, and verifying transactions.

        Attributes:
            api_base_url (str): The base URL for the MoMo API.
            api_key (str): The API key for authentication.
            subscription_key (str): The subscription key for the MoMo API.
            user_id (str): The user ID for authentication.
            session (requests.Session): The requests session for making API calls.
            token (str): The access token for authenticated requests.
            auth (str): The base64 encoded authentication string.
        """
    def __init__(self, api_key, subscription_key, user_id):
        """
               Initializes the Momo client and authenticates the user.

               Args:
                   api_key (str): The API key for authentication.
                   subscription_key (str): The subscription key for the MoMo API.
                   user_id (str): The user ID for authentication.
               """
        self.api_base_url = API_BASE_URL
        self.api_key = api_key
        self.subscription_key = subscription_key
        self.user_id = user_id
        self.session = requests.Session()
        self.token = ""
        self.auth = str(
            encode(self.user_id, self.api_key))

        self.session.headers.update({
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            # "X-Reference-Id": self.user_id,
            "X-Reference-Id": str(uuid.uuid4()),
            "Content-Type": "application/json",
            "X-Target-Environment": "sandbox",
            "Authorization": str(self.auth),
        })
        self.get_token()

    def get_token(self):
        """
                Retrieves and sets the access token for authenticated requests.

                Raises:
                    requests.exceptions.RequestException: If an error occurs while fetching the token.
                """
        url = f"{self.api_base_url}/collection/token/"
        response = self.session.post(url)
        response.raise_for_status()
        self.token = response.json().get("access_token")

    def transfer_money(self, amount, currency, external_id, payer, payee_note, payer_message):
        """
               Initiates a money transfer request.

               Args:
                   amount (str): The amount of money to transfer.
                   currency (str): The currency of the amount.
                   external_id (str): The external ID for the transaction.
                   payer (str): The payer's MSISDN (mobile number).
                   payee_note (str): The note for the payee.
                   payer_message (str): The message for the payer.

               Returns:
                   dict: A dictionary containing the response status code and reference ID.

               Raises:
                   requests.exceptions.RequestException: If an error occurs while initiating the transfer.
               """
        url = f"{self.api_base_url}/collection/v1_0/requesttopay"
        token = self.token
        uuidgen = str(uuid.uuid4())

        headers = {
            "Authorization": f"Bearer {token}",
            "X-Reference-Id": uuidgen,
        }
        self.session.headers.update(headers)
        payload = {
            "amount": amount,
            "currency": currency,
            "externalId": external_id,
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": payer
            },
            "payerMessage": payer_message,
            "payeeNote": payee_note
        }
        response = self.session.post(url, json=payload)
        context = {"response": response.status_code, "ref": uuidgen}
        return context

    def momobalance(self):
        """
               Retrieves the account balance.

               Returns:
                   dict: A dictionary containing the account balance details.

               Raises:
                   requests.exceptions.RequestException: If an error occurs while fetching the balance.
               """
        url = f"{self.api_base_url}/collection/v1_0/account/balance"

        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'Authorization': "Bearer " + self.token,
            'X-Target-Environment': "sandbox"
        }

        response = self.session.get(url, headers=headers, data=payload)
        json_respon = response.json()

        return json_respon

    def verifymomo(self, txn):
        """
                Verifies the status of a MoMo transaction.

                Args:
                    txn (str): The transaction ID to verify.

                Returns:
                    dict: A dictionary containing the transaction details.

                Raises:
                    requests.exceptions.RequestException: If an error occurs while verifying the transaction.
                """
        url = f"{self.api_base_url}/collection/v1_0/requesttopay/" + str(txn) + ""
        payload = {}
        headers = {
            'Authorization': "Bearer " + self.token,
        }
        self.session.headers.update(headers)
        response = self.session.get(url, data=payload)
        json_respon = response.json()

        return json_respon


if __name__ == "__main__":
    momo = Momo(API_KEY, SUBSCRIPTION_KEY, USER_ID)
    pay = momo.transfer_money("1000", "EUR", "123456", "233555417205", "Payment for services", "Thank you")
    if pay['response'] in [200, 202]:
        verify = momo.verifymomo(pay['ref'])
        print(verify)
        balance = momo.momobalance()
        print(balance)
    else:
        print('Something went wrong')
