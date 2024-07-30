def json(val):
    """
        Converts an object to its JSON representation if the object is not None.

        Parameters:
        val (object): The object to be converted to JSON.

        Returns:
        object: The JSON representation of the object if it is not None, otherwise returns None.
        """
    if val is not None:
        return val.toJson()
    else:
        return None


def nonNull(old: dict):
    """
        Removes key-value pairs from a dictionary where the value is None.

        Parameters:
        old (dict): The original dictionary containing key-value pairs.

        Returns:
        dict: A new dictionary with all key-value pairs where the value is not None.
        """
    new = {}
    for k, v in old.items():
        if v is not None:
            new[k] = v

    return new


class Info1:
    def __init__(self, display_name, variable_name, value: str):
        """
                Initializes an Info1 instance.

                Parameters:
                display_name (str): The display name for the info.
                variable_name (str): The variable name for the info.
                value (str): The value associated with the info.
                """
        self.display_name = display_name
        self.variable_name = variable_name
        self.value = value

    def toJson(self):
        """
                Converts the Info1 instance to a JSON-compatible dictionary.

                Returns:
                dict: The JSON representation of the Info1 instance.
                """
        return nonNull({
            'display_name': self.display_name,
            'variable_name': self.variable_name,
            'value': str(self.value)
        })


class Info2:
    def __init__(self, display_name, variable_name, value: str):
        """
                    Initializes an Info2 instance.

                    Parameters:
                    display_name (str): The display name for the info.
                    variable_name (str): The variable name for the info.
                    value (str): The value associated with the info.
                    """
        self.display_name = display_name
        self.variable_name = variable_name
        self.value = value

    def toJson(self):
        """
                Converts the Info2 instance to a JSON-compatible dictionary.

                Returns:
                dict: The JSON representation of the Info2 instance.
                """
        return nonNull({
            'display_name': self.display_name,
            'variable_name': self.variable_name,
            'value': str(self.value)
        })


class CustomFields:
    def __init__(self, info_1: Info1, info_2: Info2):
        """
                Initializes a CustomFields instance.

                Parameters:
                info_1 (Info1): An Info1 instance.
                info_2 (Info2): An Info2 instance.
                """
        self.info_1 = info_1
        self.info_2 = info_2

    def toJson(self):
        """
                Converts the CustomFields instance to a JSON-compatible dictionary.

                Returns:
                dict: The JSON representation of the CustomFields instance.
                """
        return nonNull(
            {
                'info1': json(self.info_1),
                'info2': json(self.info_2)
            }
        )


class Metadata(CustomFields):
    def __init__(self, cart_id, custom_fields, info_1: Info1, info_2: Info2):
        """
                Initializes a Metadata instance.

                Parameters:
                cart_id (str): The cart ID.
                custom_fields (CustomFields): An instance of CustomFields.
                info_1 (Info1): An Info1 instance.
                info_2 (Info2): An Info2 instance.
                """
        super().__init__(info_1, info_2)
        self.cart_id = cart_id
        self.custom_fields = custom_fields
        self.info_1 = info_1
        self.info_2 = info_2

    def toJson(self):
        """
                Converts the Metadata instance to a JSON-compatible dictionary.

                Returns:
                dict: The JSON representation of the Metadata instance.
                """
        return nonNull({
            'cart_id': self.cart_id,
            'custom_fields': [json(i) for i in self.custom_fields] if self.custom_fields is not None else None,
            'info_1': self.info_1.toJson() if self.info_1 else None,
            'info_2': self.info_2.toJson() if self.info_2 else None
        })


class InitializeBody:
    def __init__(self, email, amount, currency=None, reference=None, callback_url=None, plan=None,
                 invoice_limit=None, metadata: Metadata = None, channels=None, split_code=None, subaccount=None,
                 transaction_charge=None, bearer=None):
        """
               Initializes an InitializeBody instance.

               Parameters:
               currency (str): The currency code (e.g., 'USD').
               reference (str): The transaction reference.
               callback_url (str): The URL to call back after the transaction.
               plan (str): The plan identifier.
               invoice_limit (int): The invoice limit.
               metadata (Metadata): An instance of Metadata.
               channels (list of str): A list of payment channels.
               split_code (str): The split code for transaction splitting.
               subaccount (str): The subaccount identifier.
               transaction_charge (int): The transaction charge amount.
               bearer (str): The bearer token for authentication.
               email (str, optional): The user's email address.
               amount (int, optional): The transaction amount.
               """
        self.email = email
        self.amount = amount
        self.currency = currency
        self.reference = reference
        self.callback_url = callback_url
        self.plan = plan
        self.invoice_limit = invoice_limit
        self.metadata = metadata
        self.channels = channels
        self.split_code = split_code
        self.subaccount = subaccount
        self.transaction_charge = transaction_charge
        self.bearer = bearer

    def toJson(self):
        """
               Converts the InitializeBody instance to a JSON-compatible dictionary.

               Returns:
               dict: The JSON representation of the InitializeBody instance.
               """
        return nonNull({
            'email': self.email,
            'amount': int(self.amount),
            'currency': self.currency,
            'reference': self.reference,
            'callback_url': self.callback_url,
            'plan': self.plan,
            'invoice_limit': self.invoice_limit,
            'metadata': json(self.metadata),
            'channels': self.channels,
            'auth_code': self.split_code,
            'subaccount': self.subaccount,
            'transaction_charge': self.transaction_charge,
            'bearer': self.bearer

        })


class ChargeAuth(InitializeBody):
    def __init__(self, email, authorization_code, amount, currency=None, reference=None, callback_url=None,
                 invoice_limit=None,
                 channels=None, split_code=None, subaccount=None, transaction_charge=None, bearer=None,
                 custom_fields: CustomFields = None,
                 cart_id=None, queue=None
                 ):
        """
               Initializes a ChargeAuth instance.

               Parameters:
               currency (str): The currency code (e.g., 'USD').
               reference (str): The transaction reference.
               callback_url (str): The URL to call back after the transaction.
               invoice_limit (int): The invoice limit.
               channels (list of str): A list of payment channels.
               split_code (str): The split code for transaction splitting.
               subaccount (str): The subaccount identifier.
               transaction_charge (int): The transaction charge amount.
               bearer (str): The bearer token for authentication.
               custom_fields (CustomFields): An instance of CustomFields.
               cart_id (str): The cart ID.
               queue (str): The queue identifier.
               authorization_code (str, optional): The authorization code for the transaction.
               email (str, optional): The user's email address.
               amount (int, optional): The transaction amount.
               """
        # custom_fields = CustomFields(info1, info2) if custom_fields else None

        super().__init__(email, amount, currency, reference, callback_url, invoice_limit, channels,
                         split_code, subaccount, transaction_charge, bearer)
        self.email = email
        self.amount = amount
        self.currency = currency
        self.reference = reference
        self.callback_url = callback_url
        self.invoice_limit = invoice_limit
        self.channels = channels
        self.split_code = split_code
        self.subaccount = subaccount
        self.transaction_charge = transaction_charge
        self.bearer = bearer
        self.authorization_code = authorization_code
        self.cart_id = cart_id
        self.custom_fields = custom_fields
        self.queue = queue

    def toJson(self):
        """
                Converts the ChargeAuth instance to a JSON-compatible dictionary.

                Returns:
                dict: The JSON representation of the ChargeAuth instance.
                """
        return nonNull({
            'email': self.email,
            'amount': str(self.amount),
            'currency': self.currency,
            'reference': self.reference,
            'callback_url': self.callback_url,
            'plan': self.plan,
            'invoice_limit': str(self.invoice_limit),
            'channels': self.channels,
            'auth_code': self.split_code,
            'subaccount': self.subaccount,
            'transaction_charge': str(self.transaction_charge),
            'bearer': self.bearer,
            'authorization': self.authorization_code,
            'cart_id': self.cart_id,
            'custom_fields': json(self.custom_fields),
            'queue': self.queue,

        })


if __name__ == '__main__':
    info1 = Info1('Display Name 1', 'Variable Name 1', 'Value 1')
    info2 = Info2('Display Name 2', 'Variable Name 2', 'Value 2')
    custom1_fields = [Info1('Custom Field 1', 'Custom Variable 1', 'Custom Value 1'),
                      Info2('Custom Field 2', 'Custom Variable 2', 'Custom Value 2')]
    metadata = Metadata('Cart123', custom1_fields, info1, info2)
    custom_fields = CustomFields(info1, info2)

    charge_auth = ChargeAuth(
        currency='USD',
        reference='REF123',
        callback_url='https://example.com/callback',
        invoice_limit=10,
        channels=['card', 'bank'],
        split_code='SPLIT123',
        subaccount='SUB123',
        transaction_charge=100,
        bearer='bearer',
        authorization_code='AUTH123',
        email='user@example.com',
        amount=5000,
        cart_id='Cart123',
        custom_fields=custom_fields,
        queue='Queue123'
    )

    print(charge_auth.toJson())

    initial_body = InitializeBody(
        currency='USD',
        reference='REF123',
        callback_url='https://example.com/callback',
        plan='PLAN123',
        invoice_limit=10,
        metadata=metadata,
        channels=['card', 'bank'],
        split_code='SPLIT123',
        subaccount='SUB123',
        transaction_charge=100,
        bearer='bearer',
        email='user@example.com',
        amount=5000
    )

    print(initial_body.toJson())
