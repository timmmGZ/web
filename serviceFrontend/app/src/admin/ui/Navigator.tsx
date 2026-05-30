import React, {KeyboardEvent, useState} from 'react';

const Navigator = () => {
    const [keyword, setKeyword] = useState('')
    const submit = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            (document.querySelector("a[class=\"nav-link button-search px-3\"]") as HTMLElement).click();
        }
    }
    return (<header
        className="navbar navbar-dark  navbar-expand-md navbar-expand-sm navbar-expand-xs sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a href="/admin/songs/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">Admin</a>
        <button className="navbar-toggler position-absolute d-md-none collapsed ms-auto me-auto" type="button" data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                aria-label="Toggle navigation">
            <span>Menu</span>
        </button>
        <input className="form-control form-control-dark w-100 rounded-0 border-0" type="text" placeholder="Search"
               aria-label="Search" onChange={e => {
            setKeyword(e.target.value);
        }} onKeyUp={submit}/>
        <div className="navbar-nav">
            <div className="nav-item text-nowrap">
                <a id="search" className="nav-link button-search px-3"
                   href={"/admin/songs/?keyword=" + keyword}>Search</a>
            </div>
        </div>
    </header>);
};

export default Navigator;
