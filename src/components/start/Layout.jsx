import Header from '../head/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <header>
            <Header />
        </header>

        <main className='App'>
            <Outlet />
        </main>
        </>
    )
}

export default Layout;