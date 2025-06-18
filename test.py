import requests

url = "http://localhost:5000/chatbot"
data = {
    "bmi_info": {
        "name": "John Doe",
        "bmi": 20.5,
        "height": 156,
        "weight": 50,
        "age": 15,
        "gender": "male"
    },
    "message": "Am I healthy enough?"
}

response = requests.post(url, json=data)

print(data)
print(response.status_code)
print(response.json()["answer"])