
import UsernamePasswordForm from "./UsernamePasswordForm";
import { sendPostRequest } from "./sendPostRequest";
import { useNavigate } from "react-router";


export default function RegisterPage(props) {
    
    const navigate = useNavigate();
    
    const handleSubmit = async (username, password) => {
       
        console.log('Username:', username);
        console.log('Password:', password);
    
        try {
         const response = await sendPostRequest('/auth/register', {username: username, password: password})
          console.log('Registering user...');
          if (response){
            console.log(response.token);
            props.setToken(response.token);
            navigate('/');
         }
        } catch (error) {
          console.error('Error during registration:', error);
        } finally {
       
        }
      };
    
    return (
        <div>
            <h1>Register a New Account</h1>
            <UsernamePasswordForm onSubmit={handleSubmit}/>
        </div>
    );
}

