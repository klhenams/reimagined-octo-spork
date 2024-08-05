import requests
import json

from pycomms_pay.payment_package.req_body_paypal import OrderBody, Amount, PurchaseUnit

from pycomms_pay.payment_package.config import USERNAME, PASSWORD


class Paypal:
    def __init__(self, username, password):
        """
                Initializes the Paypal class with credentials and sets up the API base URL.

                :param username: PayPal API username.
                :param password: PayPal API password.
                """
        self.order_id = None
        self.base_url = "https://api-m.sandbox.paypal.com"
        self.username = username
        self.password = password
        self.auth = (self.username, self.password)
        self.authorize()

    def authorize(self):
        """
            Authorizes the PayPal API and retrieves an access token.

            This method performs a POST request to obtain an OAuth2 token for subsequent API requests.

            Returns:
                None

            Raises:
                requests.exceptions.RequestException: If an error occurs while authorizing.
            """
        url = f"{self.base_url}/v1/oauth2/token"

        data = {'grant_type': 'client_credentials'}

        response = requests.post(url, data=data, auth=self.auth)  # store this taut

        if response.status_code == 200:
            print("Request Successful")
            access_token = json.loads(response.text)["access_token"]
            print("access token success")
        else:
            print("Error:", response.text)

    def create_order(self, body: OrderBody):
        """
            Creates a PayPal order.

            Sends a POST request to create a new order with the specified details.

            :param body: An instance of OrderBody containing order details.
            :type body: OrderBody

            Returns:
                None

            Raises:
                requests.exceptions.RequestException: If an error occurs while creating the order.
            """
        url = f"{self.base_url}/v2/checkout/orders"

        response = requests.post(url, json=body.toJson(), auth=self.auth)

        if response.status_code == 201:
            print(response.text)
            self.order_id = json.loads(response.text)["id"]
            print("order ID success")
        else:
            print("Error:", response.text)
        return response

    def capture_order(self, order_id: str):
        """
            Captures a PayPal order.

            Sends a POST request to capture the specified order.

            :param order_id: The ID of the order to be captured.
            :type order_id: str

            Returns:
                str: The response text from the capture request.

            Raises:
                requests.exceptions.RequestException: If an error occurs while capturing the order.
            """
        url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"

        data = {}

        response = requests.post(url, json=data, auth=self.auth)

        if response.status_code == 201:
            print(response.text)
            print("Success", response.text)
            # order_id = json.loads(response.text)["id"]
            # print("order ID success")
        else:
            print("Error:", response.text)
        return response.text


if __name__ == '__main__':
    paypal = Paypal(USERNAME, PASSWORD)
    body = OrderBody(
        purchase_units=[
            PurchaseUnit(amount=Amount('USD', 100))
        ],
        intent='CAPTURE'
    )
    paypal.create_order(body)

    # paypal.capture_order('1VR983713F467974R')
