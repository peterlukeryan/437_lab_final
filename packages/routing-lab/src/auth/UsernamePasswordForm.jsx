import { useActionState } from "react";

export default function UsernamePasswordForm(props) {

    const fakeSendEmail = async () => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      };

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
          const userName = formData.get("username");
          const password = formData.get("password");
    
          if (!userName || !password) {
            return {
              type: "error",
              message: `Please fill in your name and email.`,
            };
          }
    
          const submitResult = await props.onSubmit(userName, password)
    
          return {
            type: "success",
            message: `You have succesfully logged in!`,
          };
        },
        null
      );
    
    return (
        <>
       {result && <p style={{ color: result.type === "error" ? "red" : "black" }}>Result: {result.message}</p>}
        <form action={submitAction}>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" disabled={isPending}/>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" disabled={isPending}/>
            </div>
            <button type="submit" disabled={isPending}>Submit</button>
        </form>
        </>
    );
}
