import base64
from email.mime.text import MIMEText


def _send_message(service, to, body, subject=''):
    """
        Sends an email message using the Gmail API.

        Args:
            service (googleapiclient.discovery.Resource): Authorized Gmail API service instance.
            to (str): The recipient's email address.
            body (str): The body of the email.
            subject (str, optional): The subject of the email. Defaults to an empty string.

        Returns:
            dict: The sent message details if successful, or None if an error occurs.

        Raises:
            Exception: If an error occurs while sending the message.
        :raise user()
        Gmail API Reference:
            The `service.users().messages().send()` method sends an email message.
        """
    message = MIMEText(body)
    message['to'] = to
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    message_body = {'raw': raw}
    try:
        message = service.users().messages().send(userId="me", body=message_body).execute()
        print(f'Message Id: {message["id"]}')
        return message
    except Exception as error:
        print(f'An error occurred: {error}')
        return None
