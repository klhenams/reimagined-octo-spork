def _list_messages(service, user_id='me', label_ids=None):
    """
        List messages from a Gmail account.

        This function retrieves a list of messages from a specified Gmail account, optionally filtered by labels.

        Args:
            service (googleapiclient.discovery.Resource): Authorized Gmail API service instance.
            user_id (str): User's email address. The special value 'me' can be used to indicate the authenticated user.
            label_ids (list, optional): List of label IDs to filter messages by. Defaults to None.

        Returns:
            list: A list of message dictionaries, each containing an 'id' and 'threadId'.

        Raises:
            Exception: If an error occurs while fetching the messages.

        :raise user()
        Gmail API Reference:
            The `service.users()` method returns an instance that allows interaction with the user's mailbox.
            Specifically, `service.users().messages().list()` retrieves a list of messages, and
            `service.users().messages().get()` retrieves a specific message by its ID.
        """
    if label_ids is None:
        label_ids = []
    try:
        # Constructing the query to fetch messages from specific labels (categories)
        query = ''
        if label_ids:
            query = 'label:' + ' label:'.join(label_ids)

        response = service.users().messages().list(userId=user_id, q=query).execute()
        messages = []
        if 'messages' in response:
            messages.extend(response['messages'])

        while 'nextPageToken' in response:
            page_token = response['nextPageToken']
            response = service.users().messages().list(userId=user_id, q=query,
                                                       pageToken=page_token).execute()
            messages.extend(response['messages'])
        return messages

    except Exception as e:
        print(f'An error occurred: {e}')
        return []


def _get_message(service, message_id, user_id='me'):
    """
       Get the full content of a specific Gmail message.

       This function retrieves the full content of a message from a specified Gmail account by message ID.

       Args:
           service (googleapiclient.discovery.Resource): Authorized Gmail API service instance.
           message_id (str): ID of the message to retrieve.
           user_id (str): User's email address. The special value 'me' can be used to indicate the authenticated user.

       Returns:
           dict: A dictionary containing the message metadata and content.

       Raises:
           Exception: If an error occurs while fetching the message.

         :raise user()
       Gmail API Reference:
           The `service.users()` method returns an instance that allows interaction with the user's mailbox.
           Specifically, `service.users().messages().get()` retrieves a specific message by its ID.
       """
    try:
        message = service.users().messages().get(userId=user_id, id=message_id).execute()
        return message
    except Exception as e:
        print(f'An error occurred: {e}')
        return []


