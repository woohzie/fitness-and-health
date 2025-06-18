import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path
import base64
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route('/getans', methods=['POST'])
def answer():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    if 'message' not in data:
        return jsonify({"error": "Missing required field: message"}), 400
    
    query = data['message']
    bmi_info = data['bmi_info']

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.4,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        },
        safety_settings={
            "harassment": "block_medium_and_above",
            "hate": "block_medium_and_above",
            "sexual": "block_medium_and_above",
            "dangerous": "block_medium_and_above",
        }
    )

    system_instructions = """
        You are a helpful health assistant that provides personalized diet and fitness advice based on BMI and other health metrics. Follow these guidelines:
        
        1. Base your responses on the provided user information
        2. Tailor advice specifically to the user's BMI category and health metrics
        3. Provide practical, actionable recommendations
        4. Include scientific reasoning when appropriate
        5. Include appropriate disclaimers when necessary
        6. Be conversational and supportive in tone
    """

    dir = Path("knowledge_base")

    bmi_context = None
    path = dir / "bmi_health_context.txt"
    with path.open(encoding="utf-8") as f:
        bmi_context = f.read()

    bmi_guideline = None
    path = dir / "bmi_health_guidelines.txt"
    with path.open(encoding="utf-8") as f:
        bmi_guideline = f.read()

    eating = None
    path = dir / "healthy_eating_guidelines.txt"
    with path.open(encoding="utf-8") as f:
        eating = f.read()

    activity = None
    path = dir / "physical_activity_guidelines.txt"
    with path.open(encoding="utf-8") as f:
        activity = f.read()
    
    reliable = None
    path = dir / "reliable_health_data_sources.txt"
    with path.open(encoding="utf-8") as f:
        reliable = f.read()

    context = f"""
        BMI Health Context:
        {bmi_context}

        BMI Health Guideline:
        {bmi_guideline}

        Healthy Eating Guideline:
        {eating}

        Physicial Activity Guideline:
        {activity}

        Reliable Health Data:
        {reliable}
    """

    user_info = f"""
        Name: {bmi_info["username"]}
        BMI: {bmi_info["bmi"]}
        Height: {bmi_info["height"]}
        Weight: {bmi_info["weight"]}
        Age: {bmi_info["age"]}
        Gender: {bmi_info["gender"]}
    """

    full_prompt = f"""
            You are a helpful health assistant that provides personalized diet and fitness advice based on BMI and other health metrics.
            
            CONTEXT TO HELP:
            {context}

            USER INFORMATION:
            {user_info}

            USER QUERY:
            {query}
            
            Please provide a helpful, accurate response based on the user's query and health context.
    """

    full_prompt = f"""
            {system_instructions}
            
            CONTEXT TO HELP:
            {context}

            USER INFORMATION:
            {user_info}

            USER QUERY:
            {query}
            
            Please provide a helpful, accurate response based on the user's query and health context.
    """

    try:
        response = model.generate_content(full_prompt)
        return jsonify({"answer": response.text}), 200
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I encountered an error processing your request. Please try again."


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
