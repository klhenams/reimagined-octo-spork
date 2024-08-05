import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from pycomms_pay.email_package.trash import _trash_message
from pycomms_pay.email_package.fetching import _list_messages, _get_message
from pycomms_pay.email_package.send import _send_message

SCOPES = ['https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.readonly'
          ]


class Gmail:
    """
        A class to interact with Gmail API for sending, fetching, and deleting emails.

        Attributes:
            creds (google.oauth2.credentials.Credentials): The OAuth2 credentials for the Gmail API.
            credentials_path (str): Path to the credentials JSON file.
            token_path (str): Path to the token file.
            service (googleapiclient.discovery.Resource): The Gmail API service instance.
        """
    def __init__(self, credentials_path: str, token_path: str):
        """
                Initializes the Gmail client and authenticates the user.

                Args:
                    credentials_path (str): Path to the credentials JSON file.
                    token_path (str): Path to the token file.
                """
        self.creds = None
        self.credentials_path = credentials_path
        self.token_path = token_path
        self.service = None
        self._authenticate()

    def _authenticate(self):
        """
             Authenticates the user and creates a Gmail API service instance.
                """
        if os.path.exists(self.token_path):
            self.creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)

        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_path, SCOPES)
                self.creds = flow.run_local_server(port=0)

            with open(self.token_path, 'w') as token:
                token.write(self.creds.to_json())
        self.service = build('gmail', 'v1', credentials=self.creds)

    def send_message(self, to: str, subject: str, body: str):
        """
               Sends an email message.

               Args:
                   to (str): The recipient's email address.
                   subject (str): The subject of the email.
                   body (str): The body of the email.

               Returns:
                   dict: The sent message details.
               """
        return _send_message(self.service, to, body, subject)

    def trash_message(self, message_id):
        """
                Deletes a message.

                Args:
                    message_id (str): The ID of the message to be trashed.
                """
        _trash_message(self.service, 'me', message_id)

    def messages(self, label_ids=None):
        """
                Retrieves a list of messages from the user's mailbox.

                Args:
                    label_ids (list, optional): List of label IDs to filter messages by. Defaults to None.

                Returns:
                    list: A list of message dictionaries, each containing an 'id' and 'threadId'.
                """
        if label_ids is None:
            label_ids = []
        return _list_messages(self.service, label_ids=label_ids)

    def get_message(self, message_id):
        """
                Retrieves the full content of a specific message.

                Args:
                    message_id (str): The ID of the message to retrieve.

                Returns:
                    dict: A dictionary containing the message metadata and content.
                """
        return _get_message(self.service, message_id)


if __name__ == '__main__':
    gmail = Gmail('C:/Users/zino/Downloads/credentials.json', 'token.pickle')
    messages = gmail.messages(label_ids=['INBOX'])

    for i in messages:
        print(i)

