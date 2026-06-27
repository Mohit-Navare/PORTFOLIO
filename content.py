from flask import Flask, render_template, send_from_directory, send_file
import os
from content import PAGE_CONTENT

app = Flask(__name__, template_folder="templates", static_folder="static")


@app.route("/")
def index():
    return render_template("index.html", content=PAGE_CONTENT)


@app.route("/download-resume")
def download_resume():
    resume_path = os.path.join(app.root_path, "assets", "pdf", "mohit-navare-resume.pdf")
    return send_file(resume_path, as_attachment=True, download_name="mohit-navare-resume.pdf")


@app.route("/assets/<path:filename>")
def serve_assets(filename: str):
    return send_from_directory(os.path.join(app.root_path, "assets"), filename)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
