import React from 'react';

const Menu = () => {
    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3 sidebar-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/">
                            Main App
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/admin/songs/">
                            Song List
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="/admin/songs/create/">
                            Add Song
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Menu;