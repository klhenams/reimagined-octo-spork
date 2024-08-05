from django.shortcuts import get_object_or_404
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_exempt

from .models import Menu, SessionData


# Session storage
active_sessions = {}

class USSDSession:
    def __init__(self):
        self.state = 'start'
        self.user_data = {
            'sessionId': '',
            'phoneNumber': '',
            'data': {},
        }
        self.variable_name = ''

@csrf_exempt
def ussd_endpoint(request, menu_id):
    global active_sessions
    if request.method == 'POST':
        # Retrieve or create USSD session object for the user
        session_id = request.POST.get('sessionId')
        if session_id in active_sessions:
            session = active_sessions[session_id]
        else:
            session = USSDSession()
            active_sessions[session_id] = session

        # Retrieve ussd POST data from request
        ussd_input = request.POST.get('text', '')
        phoneNumber = request.POST.get('phoneNumber')

        # Save to session user data
        session.user_data['sessionId'] = session_id
        session.user_data['phoneNumber'] = phoneNumber
        session.user_data['menuId'] = menu_id

        # Parse incoming USSD request
        ussd_text = ussd_input.split('*')[-1]

        # Process USSD request based on current state
        response = process_input(session, ussd_text, menu_id)

        # Send USSD response
        return HttpResponse(response)
    else:
        # Handle other HTTP methods if necessary
        return HttpResponse("Method not allowed, Use POST", status=405)

def process_input(session, input, menu_id):
    state_handlers = {
        'start': handle_start_state,
        'select_option': handle_select_option_state,
        'select_sub_option': handle_select_sub_option_state,
        'select_third_sub_option' : handle_select_third_sub_option_state,
        'select_fourth_sub_option' : handle_select_fourth_sub_option_state,
        'select_fifth_sub_option' : handle_select_fifth_sub_option_state,
        'select_sixth_sub_option' : handle_select_sixth_sub_option_state,
        'select_seventh_sub_option' : handle_select_seventh_sub_option_state,
        'select_eighth_sub_option' : handle_select_eighth_sub_option_state,
        'select_final_sub_option' : handle_select_final_sub_option_state,
        'user_input_data': handle_user_input_data,
    }

    handler = state_handlers.get(session.state)
    if handler:
        return handler(session, input, menu_id)
    else:
        return "END Invalid session state. Please start again."

def handle_start_state(session, input, menu_id):
    try:
        menu = Menu.objects.get(id=menu_id)
        session.selected_menu = menu
        options = menu.menuoption_set.filter(parent_option=None)  # Only top-level options

        # Expects input data option
        if options.exists() and options[0].expects_input:
            response = f"CON {options[0].name}:\n"
            session.state = 'user_input_data'
            session.next_state = 'select_option'
            session.variable_name = options[0].value
        else:
            response = f"CON Welcome to {menu.name}. Kindly choose an option below:\n"
            for i, option in enumerate(options, start=1):
                response += f"{i}. {option.name}\n"
            session.state = 'select_option'
    except Menu.DoesNotExist:
        response = "END Invalid menu. Please try again."
    return response

def handle_select_option_state(session, input, menu_id):
    global selected_option
    try:
        menu = Menu.objects.get(id=menu_id)
        selected_option_index = int(input)
        #
        selected_option = session.selected_menu.menuoption_set.filter(parent_option=None)[selected_option_index - 1]
        sub_options = selected_option.child_options.all()

        if sub_options.exists():
            # Expects input data option
            if sub_options[0].expects_input:
                response = f"CON {sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_sub_option'
                session.variable_name = sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, sub_option in enumerate(sub_options, start=1):
                    response += f"{i}. {sub_option.name}\n"
                session.state = 'select_sub_option'
        else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid option."
    return response

def handle_select_sub_option_state(session, input, menu_id):
    global selected_sub_option
    try:
        menu = Menu.objects.get(id=menu_id)
        selected_sub_option_index = int(input)
        selected_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_option)[selected_sub_option_index - 1]
        third_sub_options = selected_sub_option.child_options.all()

        if third_sub_options.exists():
            if third_sub_options[0].expects_input:
                response = f"CON {third_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_third_sub_option'
                session.variable_name = third_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, third_sub_option in enumerate(third_sub_options, start=1):
                    response += f"{i}. {third_sub_option.name}\n"
                session.state = 'select_third_sub_option' 
        else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_third_sub_option_state(session, input, menu_id):
    global selected_third_sub_option
    try:
        menu = Menu.objects.get(id=menu_id)
        selected_third_sub_option_index = int(input)
        selected_third_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_sub_option)[selected_third_sub_option_index - 1]
        fourth_sub_options = selected_third_sub_option.child_options.all()

        if fourth_sub_options.exists():
            if fourth_sub_options[0].expects_input:
                response = f"CON {fourth_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_fourth_sub_option'
                session.variable_name = fourth_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, fourth_sub_option in enumerate(fourth_sub_options, start=1):
                    response += f"{i}. {fourth_sub_option.name}\n"
                session.state = 'select_fourth_sub_option' 
        else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_fourth_sub_option_state(session, input, menu_id):
    global selected_fourth_sub_option
    try:
       menu = Menu.objects.get(id=menu_id) 
       selected_fourth_sub_option_index = int(input)
       selected_fourth_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_third_sub_option)[selected_fourth_sub_option_index - 1]
       fifth_sub_options = selected_fourth_sub_option.child_options.all()

       if fifth_sub_options.exists():
            if fifth_sub_options[0].expects_input:
                response = f"CON {fifth_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_fifth_sub_option'
                session.variable_name = fifth_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, fifth_sub_option in enumerate(fifth_sub_options, start=1):
                    response += f"{i}. {fifth_sub_option.name}\n"
                session.state = 'select_fifth_sub_option' 
       else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_fifth_sub_option_state(session, input, menu_id):
    global selected_fifth_sub_option
    try:
       menu = Menu.objects.get(id=menu_id) 
       selected_fifth_sub_option_index = int(input)
       selected_fifth_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_fourth_sub_option)[selected_fifth_sub_option_index - 1]
       sixth_sub_options = selected_fifth_sub_option.child_options.all()

       if sixth_sub_options.exists():
            if sixth_sub_options[0].expects_input:
                response = f"CON {sixth_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_sixth_sub_option'
                session.variable_name = sixth_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, sixth_sub_option in enumerate(sixth_sub_options, start=1):
                    response += f"{i}. {sixth_sub_option.name}\n"
                session.state = 'select_sixth_sub_option' 
       else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_sixth_sub_option_state(session, input, menu_id):
    global selected_sixth_sub_option
    try:
       menu = Menu.objects.get(id=menu_id) 
       selected_sixth_sub_option_index = int(input)
       selected_sixth_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_fifth_sub_option)[selected_sixth_sub_option_index - 1]
       seventh_sub_options = selected_sixth_sub_option.child_options.all()

       if seventh_sub_options.exists():
            if seventh_sub_options[0].expects_input:
                response = f"CON {seventh_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_seventh_sub_option'
                session.variable_name = seventh_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, seventh_sub_option in enumerate(seventh_sub_options, start=1):
                    response += f"{i}. {seventh_sub_option.name}\n"
                session.state = 'select_seventh_sub_option' 
       else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_seventh_sub_option_state(session, input, menu_id):
    global selected_seventh_sub_option
    try:
       menu = Menu.objects.get(id=menu_id) 
       selected_seventh_sub_option_index = int(input)
       selected_seventh_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_sixth_sub_option)[selected_seventh_sub_option_index - 1]
       eighth_sub_options = selected_seventh_sub_option.child_options.all()

       if eighth_sub_options.exists():
            if eighth_sub_options[0].expects_input:
                response = f"CON {eighth_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_eighth_sub_option'
                session.variable_name = eighth_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, eighth_sub_option in enumerate(eighth_sub_options, start=1):
                    response += f"{i}. {eighth_sub_option.name}\n"
                session.state = 'select_eighth_sub_option' 
       else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_eighth_sub_option_state(session, input, menu_id):
    try:
       menu = Menu.objects.get(id=menu_id) 
       selected_eighth_sub_option_index = int(input)
       selected_eighth_sub_option = session.selected_menu.menuoption_set.filter(parent_option=selected_seventh_sub_option)[selected_eighth_sub_option_index - 1]
       final_sub_options = selected_eighth_sub_option.child_options.all()

       if final_sub_options.exists():
            if final_sub_options[0].expects_input:
                response = f"CON {final_sub_options[0].name}:\n"
                session.state = 'user_input_data'
                session.next_state = 'select_final_sub_option'
                session.variable_name = final_sub_options[0].value
            else:
                response = "CON Choose a sub-option:\n"
                for i, final_sub_option in enumerate(final_sub_options, start=1):
                    response += f"{i}. {final_sub_option.name}\n"
                session.state = 'select_final_sub_option' 
       else:
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response

def handle_select_final_sub_option_state(session, input, menu_id):
    try:
            menu = Menu.objects.get(id=menu_id) 
            response = f"END Thank you for using {menu.name}."
            # Save to db
            save_session_data(session)
            active_sessions.pop(session.user_data['sessionId'])
            session.state = 'start'
    except (ValueError, IndexError):
        response = "CON Invalid input. Please select a valid sub-option."
    return response



def handle_user_input_data(session, input, menu_id):
    #move to next state in the flow 
    session.state = session.next_state

    #store in user session data
    session.user_data['data'][session.variable_name] = input
    print(session.user_data)

    response = f"CON {input}\n Enter 1 to confirm:"
    return response

    # return process_input(session, input, menu_id)

def save_session_data(session):
    session_data = SessionData(
        session_id = session.user_data['sessionId'],
        menu_id = session.user_data['menuId'],
        phone_number = session.user_data['phoneNumber'],
        user_responses = session.user_data['data']


    )

    session_data.save()