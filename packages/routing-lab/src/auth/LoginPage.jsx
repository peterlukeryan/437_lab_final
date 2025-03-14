import UsernamePasswordForm from "./UsernamePasswordForm";
import { sendPostRequest } from "./sendPostRequest";
import { useActionState} from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";





export default function LoginPage(props) {
    const navigate = useNavigate();
    const handleSubmit = async (username, password) => {
       
        console.log('Username:', username);
        console.log('Password:', password);
    
        try {
         let response = await sendPostRequest('/auth/login', {username: username, password: password});
         if (response){
            console.log(response.token);
            props.setToken(response.token);
            navigate('/');
         }
          console.log('Logging in ...');
        } catch (error) {
          console.error('Error during login:', error);
        } finally {
           
        }
      };
    return (
        <div>
            <h1>Login</h1>
            <UsernamePasswordForm onSubmit={handleSubmit}/>
            <div>
            <Link to={"/register"}>
            <p>Don't have an account? Register here: </p>
            
            </Link>
            </div>
        </div>
    );
}

