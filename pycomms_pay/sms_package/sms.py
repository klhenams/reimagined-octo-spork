from twilio.rest import Client

from pycomms_pay.sms_package.config import ACC_SID, PHONE, TOKEN


class Sms:
    """
        A class to interact with the Twilio API for sending SMS messages.

        Attributes:
            account_sid (str): The Account SID for the Twilio account.
            auth_token (str): The Auth Token for the Twilio account.
            client (Client): The Twilio client used to interact with the API.
        """
    def __init__(self, account_sid, auth_token):
        """
                Initializes the Sms client.

                Args:
                    account_sid (str): The Account SID for the Twilio account.
                    auth_token (str): The Auth Token for the Twilio account.
                """
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.client = Client(account_sid, auth_token)

    def send_message(self, sender, receiver, body):
        """
                Sends an SMS message using the Twilio API.

                Args:
                    sender (str): The phone number or messaging service SID from which the message is sent.
                    receiver (str): The phone number to which the message is sent.
                    body (str): The content of the message to be sent.

                Returns:
                    dict: A dictionary containing the SID and status of the message.

                Raises:
                    Exception: If an error occurs while sending the message.
                """
        try:
            message = self.client.messages.create(
                body=body,
                from_=sender,
                to=receiver
            )
            return {"sid": message.sid, "status": message.status}
        except Exception as e:
            raise Exception(e)


if __name__ == '__main__':

    client = Sms(ACC_SID, TOKEN)
    res = client.send_message(PHONE, '+233551535009', 'Assalamu alaikum')
    print(f'response {res}')
