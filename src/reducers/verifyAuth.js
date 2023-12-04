import axios from "axios";

export default async function verifyAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        return true;
    } else {
        return false;
    }
}