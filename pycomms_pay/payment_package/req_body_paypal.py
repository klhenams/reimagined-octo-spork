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


# UNIT AMOUNT

class UnitAmount:
    """
        Represents a monetary amount in a specific currency.

        Attributes:
            currency_code (str): The currency code (e.g., 'USD').
            value (str): The monetary value.
        """

    def __init__(self, currency_code, value):
        """
                       Initializes the UnitAmount object.

                       Args:
                           currency_code (str): The currency code.
                           value (str or int or float): The monetary value.
                       """
        self.currency_code = currency_code
        self.value = str(value)

    def toJson(self):
        """
                        Converts the UnitAmount object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the UnitAmount.
                        """
        return nonNull({
            'currency_code': self.currency_code,
            'value': self.value,
        })


class UPC:
    """
           Represents a Universal Product Code (UPC).

           Attributes:
               type (str): The type of UPC.
               code (str): The UPC code.
           """

    def __init__(self, TYPE=None, code=None):
        """
                        Initializes the UPC object.

                        Args:
                            TYPE (str, optional): The type of UPC.
                            code (str, optional): The UPC code.
                        """
        self.type = TYPE
        self.code = code

    def toJson(self):
        """
                        Converts the UPC object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the UPC.
                        """
        return nonNull({
            'type': self.type,
            'code': self.code,
        })


# ITEM
class OrderItem:
    """
            Represents an item in an order.

            Attributes:
                name (str): The name of the item.
                quantity (int): The quantity of the item.
                unit_amount (UnitAmount): The unit amount of the item.
                description (str, optional): The description of the item.
                sku (str, optional): The SKU of the item.
                url (str, optional): The URL of the item.
                category (str, optional): The category of the item.
                image_url (str, optional): The image URL of the item.
                tax (UnitAmount, optional): The tax amount for the item.
                upc (UPC, optional): The UPC of the item.
            """

    def __init__(self, name, quantity, unit_amount: UnitAmount, description=None, sku=None, url=None, category=None,
                 image_url=None, tax: UnitAmount = None, upc: UPC = None):
        """
                       Initializes the OrderItem object.

                       Args:
                           name (str): The name of the item.
                           quantity (int): The quantity of the item.
                           unit_amount (UnitAmount): The unit amount of the item.
                           description (str, optional): The description of the item.
                           sku (str, optional): The SKU of the item.
                           url (str, optional): The URL of the item.
                           category (str, optional): The category of the item.
                           image_url (str, optional): The image URL of the item.
                           tax (UnitAmount, optional): The tax amount for the item.
                           upc (UPC, optional): The UPC of the item.
                       """
        self.name = name
        self.quantity = quantity
        self.unit_amount = unit_amount
        self.description = description
        self.sku = sku
        self.url = url
        self.category = category
        self.image_url = image_url
        self.tax = tax
        self.upc = upc

    def toJson(self):
        """
                        Converts the OrderItem object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the OrderItem.
                        """
        return nonNull({
            'name': self.name,
            'description': self.description,
            'quantity': self.quantity,
            'unit_amount': json(self.unit_amount),
            'sku': self.sku,
            'url': self.url,
            'category': self.category,
            'image_url': self.image_url,
            'tax': json(self.tax),
            'upc': json(self.upc)
        })


# BREAKDOWN
class Breakdown:
    """
           Represents the breakdown of amounts for an order.

           Attributes:
               item_total (UnitAmount, optional): The total amount for items.
               shipping (UnitAmount, optional): The shipping amount.
               handling (UnitAmount, optional): The handling amount.
               tax_total (UnitAmount, optional): The total tax amount.
               insurance (UnitAmount, optional): The insurance amount.
               shipping_discount (UnitAmount, optional): The shipping discount amount.
               discount (UnitAmount, optional): The discount amount.
           """

    def __init__(self, item_total: UnitAmount = None, shipping: UnitAmount = None, handling: UnitAmount = None,
                 tax_total: UnitAmount = None, insurance: UnitAmount = None, shipping_discount: UnitAmount = None,
                 discount: UnitAmount = None):
        """
                       Initializes the Breakdown object.

                       Args:
                           item_total (UnitAmount, optional): The total amount for items.
                           shipping (UnitAmount, optional): The shipping amount.
                           handling (UnitAmount, optional): The handling amount.
                           tax_total (UnitAmount, optional): The total tax amount.
                           insurance (UnitAmount, optional): The insurance amount.
                           shipping_discount (UnitAmount, optional): The shipping discount amount.
                           discount (UnitAmount, optional): The discount amount.
                       """
        self.item_total = item_total
        self.shipping = shipping
        self.handling = handling
        self.tax_total = tax_total
        self.insurance = insurance
        self.shipping_discount = shipping_discount
        self.discount = discount

    def toJson(self):
        """
                        Converts the Breakdown object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Breakdown.
                        """
        return nonNull({
            'item_total': json(self.item_total),
            'shipping': json(self.shipping),
            'handling': json(self.handling),
            'tax_total': json(self.tax_total),
            'insurance': json(self.insurance),
            'shipping_discount': json(self.shipping_discount),
            'discount': json(self.discount),
        })


# AMOUNT


class Amount(UnitAmount):
    """
           Represents the amount for an order, including optional breakdown details.

           Attributes:
               currency_code (str): The currency code.
               value (str or int or float): The monetary value.
               breakdown (Breakdown, optional): The breakdown of amounts.
           """

    def __init__(self, currency_code, value, breakdown: Breakdown = None):
        """
                       Initializes the Amount object.

                       Args:
                           currency_code (str): The currency code.
                           value (str or int or float): The monetary value.
                           breakdown (Breakdown, optional): The breakdown of amounts.
                       """
        super().__init__(currency_code, value)
        self.currency_code = currency_code
        self.value = value
        self.breakdown = breakdown

    def toJson(self):
        """
                       Converts the Amount object to a JSON-serializable dictionary.

                       Returns:
                           dict: The JSON-serializable dictionary representation of the Amount.
                       """
        return nonNull({
            'currency_code': self.currency_code,
            'value': str(self.value),
            'breakdown': json(self.breakdown),
        })


class Level2:
    """
            Represents the level 2 information for an invoice.

            Attributes:
                invoice_id (str): The invoice ID.
                tax_total (UnitAmount, optional): The total tax amount.
            """

    def __init__(self, invoice_id, tax_total: UnitAmount = None):
        """
                        Initializes the Level2 object.

                        Args:
                            invoice_id (str): The invoice ID.
                            tax_total (UnitAmount, optional): The total tax amount.
                        """
        self.invoice_id = invoice_id
        self.tax_total = tax_total

    def toJson(self):
        """
                        Converts the Level2 object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Level2.
                        """
        return nonNull({
            'invoice_id': self.invoice_id,
            'tax_total': json(self.tax_total),
        })


# LINE ITEMS

class LineItems(OrderItem):
    """
            Represents an item in a line of items, inheriting from OrderItem.

            Attributes:
                commodity_code (str, optional): The commodity code of the item.
                unit_of_measure (str, optional): The unit of measure of the item.
                tax (UnitAmount, optional): The tax amount for the item.
                discount_amount (UnitAmount, optional): The discount amount for the item.
                total_amount (UnitAmount, optional): The total amount for the item.
                upc (UPC, optional): The UPC of the item.
            """

    def __init__(self, name, quantity, unit_amount: UnitAmount, commodity_code=None, unit_of_measure=None,
                 tax: UnitAmount = None,
                 discount_amount: UnitAmount = None, total_amount: UnitAmount = None, upc: UPC = None):
        """
                       Initializes the LineItems object.

                       Args:
                           name (str): The name of the item.
                           quantity (int): The quantity of the item.
                           unit_amount (UnitAmount): The unit amount of the item.
                           commodity_code (str, optional): The commodity code of the item.
                           unit_of_measure (str, optional): The unit of measure of the item.
                           tax (UnitAmount, optional): The tax amount for the item.
                           discount_amount (UnitAmount, optional): The discount amount for the item.
                           total_amount (UnitAmount, optional): The total amount for the item.
                           upc (UPC, optional): The UPC of the item.
                       """
        super().__init__(name, quantity, unit_amount)
        self.commodity_code = commodity_code
        self.tax = tax
        self.unit_of_measure = unit_of_measure
        self.discount_amount = discount_amount
        self.total_amount = total_amount
        self.upc = upc

    def toJson(self):
        """
                       Converts the LineItems object to a JSON-serializable dictionary.

                       Returns:
                           dict: The JSON-serializable dictionary representation of the LineItems.
                       """
        return nonNull({
            'name': self.name,
            'unit_amount': json(self.unit_amount),
            'quantity': self.quantity,
            'commodity_code': self.commodity_code,
            'tax': json(self.tax),
            'unit_of_measure': self.unit_of_measure,
            'discount_amount': json(self.discount_amount),
            'total_amount': json(self.total_amount),
            'upc': json(self.upc)
        })


class ShippingAmount:
    """
            Represents the shipping amount.

            Attributes:
                unit_amount (UnitAmount, optional): The unit amount for shipping.
            """

    def __init__(self, unit_amount: UnitAmount = None):
        """
                        Initializes the ShippingAmount object.

                        Args:
                            unit_amount (UnitAmount, optional): The unit amount for shipping.
                        """
        self.unit_amount = unit_amount

    def toJson(self):
        """
                        Converts the ShippingAmount object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the ShippingAmount.
                        """
        return nonNull({
            'unit_amount': json(self.unit_amount)
        })


# DUTY_AMOUNT

class DutyAmount:
    """
           Represents the duty amount.

           Attributes:
               unit_amount (UnitAmount, optional): The unit amount for duty.
           """

    def __init__(self, unit_amount: UnitAmount = None):
        """
                       Initializes the DutyAmount object.

                       Args:
                           unit_amount (UnitAmount, optional): The unit amount for duty.
                       """
        self.unit_amount = unit_amount

    def toJson(self):
        """
                Converts the DutyAmount object to a JSON-serializable dictionary.

                Returns:
                    dict: The JSON-serializable dictionary representation of the DutyAmount.
                """
        return nonNull({
            'unit_amount': json(self.unit_amount)
        })


class DiscountAmount:
    """
            Represents the discount amount.

            Attributes:
                unit_amount (UnitAmount, optional): The unit amount for the discount.
            """

    def __init__(self, unit_amount: UnitAmount = None):
        """
                       Initializes the DiscountAmount object.

                       Args:
                           unit_amount (UnitAmount, optional): The unit amount for the discount.
                       """
        self.unit_amount = unit_amount

    def toJson(self):
        """
                        Converts the DiscountAmount object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the DiscountAmount.
                        """
        return nonNull({
            'unit_amount': json(self.unit_amount)
        })


# SHIPPING ADDRESS

class ShippingAddress:
    """
           Represents a shipping address.

           Attributes:
               address_line_1 (str): The first line of the address.
               address_line_2 (str): The second line of the address.
               admin_area_2 (str): The city or locality of the address.
               admin_area_1 (str): The state or region of the address.
               postal_code (str): The postal code of the address.
               country_code (str): The country code of the address.
           """

    def __init__(self, address_line_1, address_line_2, admin_area_2, admin_area_1,
                 postal_code, country_code):
        """
                       Initializes the ShippingAddress object.

                       Args:
                           address_line_1 (str): The first line of the address.
                           address_line_2 (str): The second line of the address.
                           admin_area_2 (str): The city or locality of the address.
                           admin_area_1 (str): The state or region of the address.
                           postal_code (str): The postal code of the address.
                           country_code (str): The country code of the address.
                       """
        self.address_line_1 = address_line_1
        self.address_line_2 = address_line_2
        self.admin_area_2 = admin_area_2
        self.admin_area_1 = admin_area_1
        self.postal_code = postal_code
        self.country_code = country_code

    def toJson(self):
        """
                       Converts the ShippingAddress object to a JSON-serializable dictionary.

                       Returns:
                           dict: The JSON-serializable dictionary representation of the ShippingAddress.
                       """
        return nonNull({
            'address_line_1': self.address_line_1,
            'address_line_2': self.address_line_2,
            'admin_area_2': self.admin_area_2,
            'admin_area_1': self.admin_area_1,
            'postal_code': self.postal_code,
            'country_code': self.country_code

        })


# LEVEL_3
class Level3:
    """
            Represents the level 3 information for a transaction.

            Attributes:
                ships_from_postal_code (str): The postal code from where the items are shipped.
                line_items (LineItems): The line items in the transaction.
                shipping_add (ShippingAmount): The shipping address information.
                duty_amount (DutyAmount): The duty amount information.
                discount_amt (DiscountAmount): The discount amount information.
                shipping_amt (ShippingAmount): The shipping amount information.
            """

    def __init__(self, ships_from_postal_code, line_items: LineItems, shipping_add: ShippingAmount,
                 duty_amount: DutyAmount, discount_amt: DiscountAmount, shipping_amt: ShippingAmount):
        """
                        Initializes the Level3 object.

                        Args:
                            ships_from_postal_code (str): The postal code from where the items are shipped.
                            line_items (LineItems): The line items in the transaction.
                            shipping_add (ShippingAmount): The shipping address information.
                            duty_amount (DutyAmount): The duty amount information.
                            discount_amt (DiscountAmount): The discount amount information.
                            shipping_amt (ShippingAmount): The shipping amount information.
                        """
        self.ships_from_postal_code = ships_from_postal_code
        self.line_items = line_items
        self.shipping_add = shipping_add
        self.shipping_amt = shipping_amt
        self.discount_amt = discount_amt
        self.duty_amt = duty_amount

    def toJson(self):
        """
                        Converts the Level3 object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Level3.
                        """
        return nonNull({
            'ships_from_postal_code': self.ships_from_postal_code,
            'line_items': self.line_items,
            'shipping_add': self.shipping_add,
            'shipping_amt': self.shipping_amt,
            'discount_amt': self.discount_amt,
            'duty_amt': self.duty_amt,
        })


class Card:
    """
           Represents a payment card with level 2 and level 3 information.

           Attributes:
               level_2 (Level2): The level 2 information.
               level_3 (Level3): The level 3 information.
           """

    def __init__(self, level_2: Level2, level_3: Level3):
        """
                       Initializes the Card object.

                       Args:
                           level_2 (Level2): The level 2 information.
                           level_3 (Level3): The level 3 information.
                       """
        self.level_2 = level_2
        self.level_3 = level_3

    def toJson(self):
        """
                        Converts the Card object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Card.
                        """
        return nonNull({
            'level_2': json(self.level_2),
            'level_3': json(self.level_3)
        })


# PAYEE

class Payee:
    """
           Represents a payee.

           Attributes:
               email_address (str): The email address of the payee.
               merchant_id (str): The merchant ID of the payee.
           """

    def __init__(self, email_address, merchant_id):
        """
                        Initializes the Payee object.

                        Args:
                            email_address (str): The email address of the payee.
                            merchant_id (str): The merchant ID of the payee.
                        """
        self.email_address = email_address
        self.merchant_id = merchant_id

    def toJson(self):
        """
                        Converts the Payee object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Payee.
                        """
        return nonNull({
            "email_address": self.email_address,
            "merchant_id": self.merchant_id
        })


class PlatformFees:
    """
            Represents platform fees.

            Attributes:
                unit_amount (UnitAmount): The unit amount of the platform fees.
                payee (Payee): The payee of the platform fees.
            """

    def __init__(self, unit_amount: UnitAmount, payee: Payee):
        """
                    Initializes the PlatformFees object.

                    Args:
                        unit_amount (UnitAmount): The unit amount of the platform fees.
                        payee (Payee): The payee of the platform fees.
                    """
        self.unit_amount = unit_amount
        self.payee = payee

    def toJson(self):
        """
                        Converts the PlatformFees object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the PlatformFees.
                        """
        return nonNull({
            'unit_amount': json(self.unit_amount),
            'payee': json(self.payee)
        })


class PaymentInstruction:
    """
           Represents payment instructions.

           Attributes:
               platform_fees (PlatformFees, optional): The platform fees.
               payee_pricing_tier_id (str, optional): The payee pricing tier ID.
               payee_receivable_fx_rate_id (str, optional): The payee receivable FX rate ID.
               disbursement_mode (str, optional): The disbursement mode.
           """

    def __init__(self, platform_fees: PlatformFees = None, payee_pricing_tier_id=None,
                 payee_receivable_fx_rate_id=None, disbursement_mode=None):
        """
                      Initializes the PaymentInstruction object.

                      Args:
                          platform_fees (PlatformFees, optional): The platform fees.
                          payee_pricing_tier_id (str, optional): The payee pricing tier ID.
                          payee_receivable_fx_rate_id (str, optional): The payee receivable FX rate ID.
                          disbursement_mode (str, optional): The disbursement mode.
                      """
        self.platform_fees = platform_fees
        self.payee_pricing_tier_id = payee_pricing_tier_id
        self.payee_receivable_fx_rate_id = payee_receivable_fx_rate_id
        self.disbursement_mode = disbursement_mode

    def toJson(self):
        """
                        Converts the PaymentInstruction object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the PaymentInstruction.
                        """
        return nonNull({
            'platform_fees': json(self.platform_fees),
            'payee_pricing_tier_id': self.payee_pricing_tier_id,
            'payee_receivable_fx_rate_id': self.payee_receivable_fx_rate_id,
            'disbursement_mode': self.disbursement_mode
        })


class Options:
    """
           Represents options for shipping.

           Attributes:
               id_num (str, optional): The ID of the option.
               label (str, optional): The label of the option.
               selected (bool, optional): Whether the option is selected.
               type (str, optional): The type of the option.
               amount (UnitAmount, optional): The amount for the option.
           """

    def __init__(self, id_num=None, label=None, selected=None, TYPE=None,
                 amount: UnitAmount = None):
        """
                      Initializes the Options object.

                      Args:
                          id_num (str, optional): The ID of the option.
                          label (str, optional): The label of the option.
                          selected (bool, optional): Whether the option is selected.
                          type (str, optional): The type of the option.
                          amount (UnitAmount, optional): The amount for the option.
                      """
        self.id = id_num
        self.label = label
        self.selected = selected
        self.type = TYPE
        self.amount = amount

    def toJson(self):
        """
                       Converts the Options object to a JSON-serializable dictionary.

                       Returns:
                           dict: The JSON-serializable dictionary representation of the Options.
                       """
        return nonNull({
            'id': self.id,
            'label': self.label,
            'selected': self.selected,
            'type': self.type,
            'amount': json(self.amount)
        })


class Name:
    """
            Represents a name.

            Attributes:
                name (str): The name.
            """

    def __init__(self, name):
        """
                        Initializes the Name object.

                        Args:
                            name (str): The name.
                        """
        self.name = name

    def toJson(self):
        """
                        Converts the Name object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Name.
                        """
        return nonNull({
            'name': self.name
        })


class Shipping:
    """
            Represents shipping information.

            Attributes:
                type (str, optional): The type of shipping.
                options (Options, optional): The shipping options.
                name (Name, optional): The name of the recipient.
                address (ShippingAddress, optional): The shipping address.
            """

    def __init__(self, TYPE=None, options: Options = None, name: Name = None,
                 address: ShippingAddress = None):
        """
                        Initializes the Shipping object.

                        Args:
                            TYPE (str, optional): The type of shipping.
                            options (Options, optional): The shipping options.
                            name (Name, optional): The name of the recipient.
                            address (ShippingAddress, optional): The shipping address.
                        """
        self.type = TYPE
        self.options = options
        self.name = name
        self.address = address

    def toJson(self):
        """
                        Converts the Shipping object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the Shipping.
                        """
        return nonNull({
            'type': self.type,
            'options': json(self.options),
            'name': json(self.name),
            'address': json(self.address)
        })


class SupplementaryData:
    """
            Represents supplementary data for a transaction.

            Attributes:
                card (Card): The card information.
            """

    def __init__(self, card: Card):
        """
                        Initializes the SupplementaryData object.

                        Args:
                            card (Card): The card information.
                        """
        self.card = card

    def toJson(self):
        """
                        Converts the SupplementaryData object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the SupplementaryData.
                        """
        return nonNull({
            'card': json(self.card)
        })


# PURCHASE UNIT


class PurchaseUnit:
    """
            Represents a purchase unit.

            Attributes:
                amount (Amount): The amount information.
                reference_id (str, optional): The reference ID.
                description (str, optional): The description of the purchase unit.
                customer_id (str, optional): The customer ID.
                invoice_id (str, optional): The invoice ID.
                soft_descriptor (str, optional): The soft descriptor.
                items (list of OrderItem, optional): The list of items in the purchase unit.
                payee (Payee, optional): The payee information.
                payment_instruction (PaymentInstruction, optional): The payment instruction information.
                shipping (Shipping, optional): The shipping information.
                supplementary_data (SupplementaryData, optional): The supplementary data.
            """

    def __init__(self, amount: Amount, reference_id=None, description=None, customer_id=None, invoice_id=None,
                 soft_descriptor=None, items: [OrderItem] = None, payee: Payee = None,
                 payment_instruction: PaymentInstruction = None,
                 shipping: Shipping = None, supplementary_data: SupplementaryData = None):
        """
                       Initializes the PurchaseUnit object.

                       Args:
                           amount (Amount): The amount information.
                           reference_id (str, optional): The reference ID.
                           description (str, optional): The description of the purchase unit.
                           customer_id (str, optional): The customer ID.
                           invoice_id (str, optional): The invoice ID.
                           soft_descriptor (str, optional): The soft descriptor.
                           items (list of OrderItem, optional): The list of items in the purchase unit.
                           payee (Payee, optional): The payee information.
                           payment_instruction (PaymentInstruction, optional): The payment instruction information.
                           shipping (Shipping, optional): The shipping information.
                           supplementary_data (SupplementaryData, optional): The supplementary data.
                       """
        self.amount = amount
        self.reference_id = reference_id
        self.description = description
        self.customer_id = customer_id
        self.invoice_id = invoice_id
        self.soft_descriptor = soft_descriptor
        self.items = items
        self.payee = payee
        self.payment_instruction = payment_instruction
        self.shipping = shipping
        self.supplementary_data = supplementary_data

    def toJson(self):
        """
                       Converts the PurchaseUnit object to a JSON-serializable dictionary.

                       Returns:
                           dict: The JSON-serializable dictionary representation of the PurchaseUnit.
                       """
        return nonNull({
            'amount': json(self.amount),
            'reference_id': self.reference_id,
            'description': self.description,
            'customer_id': self.customer_id,
            'invoice_id': self.invoice_id,
            'soft_descriptor': self.soft_descriptor,
            'items': [json(i) for i in self.items] if self.items is not None else None,
            'payee': json(self.payee),
            'payment_instruction': json(self.payment_instruction),
            'shipping': json(self.shipping),
            'supplementary_data': json(self.supplementary_data),
        })


class OrderBody:
    """
            Represents the body of an order.

            Attributes:
                purchase_units (list of PurchaseUnit): The list of purchase units.
                intent (str): The intent of the order.
            """

    def __init__(self, purchase_units: [PurchaseUnit], intent: str):
        """
                        Initializes the OrderBody object.

                        Args:
                            purchase_units (list of PurchaseUnit): The list of purchase units.
                            intent (str): The intent of the order.
                        """
        self.purchase_unit = purchase_units
        self.intent = intent

    def toJson(self):
        """
                        Converts the OrderBody object to a JSON-serializable dictionary.

                        Returns:
                            dict: The JSON-serializable dictionary representation of the OrderBody.
                        """
        return nonNull({
            'purchase_units': [json(p) for p in self.purchase_unit],
            'intent': self.intent
        })


if __name__ == '__main__':
    body = OrderBody(
        purchase_units=[
            PurchaseUnit(amount=Amount('USD', 100))
        ],
        intent='CAPTURE'
    )
    print(body.toJson())
