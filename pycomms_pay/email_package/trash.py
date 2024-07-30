def _trash_message(service, user_id, message_id):
    """
        Moves a message to the trash using the Gmail API.

        Args:
            service (googleapiclient.discovery.Resource): Authorized Gmail API service instance.
            user_id (str): The user's email address. The special value 'me' can be used to indicate the authenticated user.
            message_id (str): The ID of the message to be trashed.

        Returns:
            None

        Raises:
            Exception: If an error occurs while trashing the message.
        :raise user()
        Gmail API Reference:
            The `service.users().messages().trash()` method moves a message to the trash.
        """
    try:
        service.users().messages().trash(userId=user_id, id=message_id).execute()
        print(f'Message with ID: {message_id} deleted successfully.')
        # else:
        #     print('Failed')
    except Exception as e:
        print(f'An error occurred: {e}')
