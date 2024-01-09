import random

from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

model_name = 'Helsinki-NLP/opus-mt-en-ru'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)


app = Flask(__name__)
api = Api(app)
CORS(app)


class AiApi(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("request")
        params = parser.parse_args()

        en_text = params["request"]
        input_ids = tokenizer.encode(en_text, return_tensors="pt")
        output_ids = model.generate(input_ids, max_new_tokens=100)
        ru_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

        return {"response": ru_text}, 201


api.add_resource(AiApi, "/ai-predict")
if __name__ == '__main__':
    app.run(debug=True, port=5001)
