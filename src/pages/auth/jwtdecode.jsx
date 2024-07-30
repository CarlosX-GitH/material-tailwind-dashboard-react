import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function JWT_ReadData(token) {
    let data = null;
    if (token) {
        // Decode the token
        const decodedToken = jwtDecode(token);

        // Access the data in the payload
        data = decodedToken
        console.log(data)
        // Example: Accessing user ID
        const employeeId = data.employeeId;
        const userName = data.username;
        const userRole = data.systemrole;
        Cookies.set('username', userName,{expires: 7, secure: true})
        Cookies.set('employeeId', employeeId,{expires: 7, secure: true})
        Cookies.set('userRole', userRole,{expires: 7, secure: true})
    } else {
        console.log('Token not found');
    }
    return data
}