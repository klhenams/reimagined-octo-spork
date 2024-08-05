import requests
import json

from pycomms_pay.payment_package.req_body_paystack import InitializeBody, ChargeAuth, Metadata, CustomFields, Info2, \
    Info1

from pycomms_pay.payment_package.config import test_secret


class Paystack:
    """
    A class to interact with the Paystack API for initializing transactions, verifying transactions, and charging
    authorizations.

        Attributes:
            ref (str): The reference ID for the transaction.
            test_secret (str): The secret key for authentication.
            base_url (str): The base URL for the Paystack API.
        """

    def __init__(self, test_secret):
        """
              Initializes the Paystack client.

                Args:
                    test_secret (str): The secret key for authentication.
                """
        self.authorize = None
        self.access_code = None
        self.ref = None
        self.test_secret = test_secret
        self.base_url = "https://api.paystack.co"

    def initialize_transaction(self, initial_body: InitializeBody):
        """
                Sends a request to initialize a transaction and retrieves the access code.

                This method initializes a transaction using the provided details and retrieves
                an access code for further processing. The access code can be used for redirecting
                the user to the Paystack payment page or for other transaction operations.

                :param initial_body: An instance of InitializeBody containing transaction details.
                :type initial_body: InitializeBody

                :raises Exception: If the request fails or the response status code is not 201.

                :return: None
                """
        url = f"{self.base_url}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {self.test_secret}",
            "Content_Type": "application/json"
        }

        response = requests.post(url, headers=headers, json=initial_body.toJson())

        if response.status_code == 201:
            print("Request Successful")
            self.access_code = json.loads(response.text)["data"]
            print("access code success")
        else:
            print("Error:", response.json())

    def verify_transaction(self,ref):
        """
                Sends a request to verify a transaction using the provided reference.

                This method verifies a transaction with the given reference and retrieves
                details about the transaction. If successful, it updates the `access_code`
                with the data from the response.

                :param ref: The reference or token for the transaction to be verified.
                :type ref: str

                :raises Exception: If the request fails or the response status code is not 200.

                :return: None
                """
        url = f"{self.base_url}/transaction/verify/{ref}"
        headers = {
            "Authorization": f"Bearer {self.test_secret}",
            "Content_Type": "application/json"
        }
        response = requests.get(url, headers=headers)

        if response.status_code == 201:
            print("Request Successful")
            self.access_code = json.loads(response.text)["data"]
            print("access code success")
        else:
            print(response.json())

    def charge_authorization(self, auth, charge_auth: ChargeAuth):
        """
               Sends a request to verify a charge authorization and update the access code.

               This method verifies a transaction authorization and retrieves the access code
               associated with it. It uses the provided authorization and charge details to
               perform the verification.

               :param auth: The authorization reference or token for the charge.
               :type auth: str
               :param charge_auth: An instance of ChargeAuth containing charge details.
               :type charge_auth: ChargeAuth

               :raises Exception: If the request fails or the response status code is not 200.

               :return: None
               """
        self.authorize = auth

        url = f"{self.base_url}/transaction/verify/{auth}"
        headers = {
            "Authorization": f"Bearer {self.test_secret}",
            "Content_Type": "application/json"
        }

        response = requests.post(url, headers=headers, json=charge_auth.toJson())

        if response.status_code == 200:
            print("Request Successful")
            self.access_code = json.loads(response.text)["data"]
            print("access code success")
        else:
            print("Error:", response.json())


if __name__ == '__main__':
    paystack = Paystack(test_secret)

    info1 = Info1('Display Name 1', 'Variable Name 1', 'Value 1')
    info2 = Info2('Display Name 2', 'Variable Name 2', 'Value 2')
    custom1_fields = [Info1('Custom Field 1', 'Custom Variable 1', 'Custom Value 1'),
                     Info2('Custom Field 2', 'Custom Variable 2', 'Custom Value 2')]
    metadata = Metadata('Cart123', custom1_fields, info1, info2)
    custom_fields = CustomFields(info1,info2)

    initial_body = InitializeBody(
        email='sbarhin@email.com',
        amount=100.00,
        currency='GHS',
        reference="good",
        callback_url='https://example.com/',
        plan='PLN_5iqere3ep5wqu03',
        invoice_limit=10,
        metadata=metadata,
        channels=['mobile_money', 'card'],
        # split_code='SPL_123AbZ',
        transaction_charge=140.66,
        # bearer='subaccount'

    )
    #paystack.initialize_transaction(initial_body)

    paystack.verify_transaction('good')

    charge_auth = ChargeAuth(
        email='user@example.com',
        currency='GHS',
        amount=50.00,
        reference='real',
        callback_url='https://example.com/',
        invoice_limit=10,
        channels=['card', 'bank'],
        # split_code='SPLIT123',
        transaction_charge=100.00,
        # bearer='bearer',
        authorization_code='',
        cart_id='Cart123',
        custom_fields=custom_fields,
        queue='Queue123'
    )
    #print(charge_auth.toJson())

