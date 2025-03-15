import { useState } from "react";
import { useActionState } from "react";

export default function ImageUploadForm(props) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [imageTitle, setImageTitle] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [result, submitAction, isPending] = useActionState(
        async (previousState, _) => {
            // Check if title and file are provided
            if (!imageTitle || !file) {
                return {
                    type: "error",
                    message: "Please provide both an image and a title.",
                };
            }
            const formData = new FormData();
            formData.append("image", file);
            formData.append("name", imageTitle);

            try {
                const response = await fetch("/api/images", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${props.token}`, // Add your auth token here
                    },
                });

                if (!response.ok) {
                    return {
                        type: "error",
                        message: `Upload failed: ${response.statusText}`,
                    };
                }

                return {
                    type: "success",
                    message: `You have successfully uploaded the image!`,
                };
            } catch (error) {
                console.error(error);
                return {
                    type: "error",
                    message: "An error occurred during the upload. Please try again later.",
                };
            }
        },
        null
    );

    return (
        <>
            {result && (
                <p
                    style={{
                        color: result.type === "error" ? "red" : "black",
                    }}
                >
                    Result: {result.message}
                </p>
            )}

            <form action={submitAction}>
                <div>
                    <label htmlFor="image">Choose image to upload:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        disabled={isPending}
                    />
                </div>

                <div>
                    <label htmlFor="imageTitle">Image title:</label>
                    <input
                        type="text"
                        id="imageTitle"
                        name="name"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        disabled={isPending}
                    />
                </div>

                <div>
                    {previewUrl && <img style={{ maxWidth: "20em" }} src={previewUrl} alt="Image preview" />}
                </div>

                <button type="submit" disabled={isPending}>
                    Confirm upload
                </button>
            </form>
        </>
    );
}

