# GDScript Formatter Backend

Welcome to the GDScript Formatter Backend! This backend server is designed to format, lint, and convert GDScript. This runs on Bun and ElysiaJS. [Gdtoolkit](https://github.com/Scony/godot-gdscript-toolkit) is used for formatting and linting of GDScript. It exposes various routes to enhance the functionality of GDScript development. This is currently being used on [GDScript Formatter](https://www.gdscriptformatter.com/).

## Routes

### 1. Health Checker

- **Endpoint:** `/health`
- **Description:** This route serves as a health checker for the backend server. It provides a quick way to verify the operational status of the server.

### 2. GDScript Formatting

- **Endpoint:** `/v1/format/gd-script`
- **Description:** Use this route to format GDScript code. It leverages the capabilities of the [Gdtoolkit](https://github.com/Scony/godot-gdscript-toolkit) gdformat command, ensuring that your GDScript adheres to a consistent and readable style.

### 3. GDScript Linting

- **Endpoint:** `/v1/lint/gd-script`
- **Description:** Perform linting on your GDScript code using [Gdtoolkit](https://github.com/Scony/godot-gdscript-toolkit) gdlint command. This route helps identify and highlight potential issues in your code, promoting better code quality.

### 4. GDScript to C# Conversion

- **Endpoint:** `/v1/convert/gdscript-csharp`
- **Description:** Employ this route to leverage Chat GPT for converting GDScript code to C#.

### 5. C# to GDScript Conversion

- **Endpoint:** `/v1/convert/csharp-gdscript`
- **Description:** Utilize this route to use Chat GPT for converting C# code to GDScript.

## Deployment

The GDScript Formatter Backend is automatically deployed using GitHub Actions. The deployment process is triggered upon merging changes into the `main` branch. The server is hosted on [fly.io](https://fly.io/), ensuring reliable and scalable hosting for your backend.

### Deployment Steps

1. Make changes to the code.
2. Create a pull request.
3. After code review, merge the changes into the `main` branch.
4. GitHub Actions will automatically trigger the deployment process.
5. Check the status of the deployment on [fly.io](https://fly.io/).

Feel free to explore and contribute to the GDScript Formatter Backend. If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request.

Happy coding!