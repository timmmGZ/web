import React, {PropsWithChildren} from 'react';
import Navigator from "./Navigator";
import Menu from "./Menu";

const UI = (props: PropsWithChildren<any>) => {
    return (
        <div>
            <Navigator/>
            <div className="container-fluid p-0 overflow-hidden">
                  <div className="row g-0">
                    <Menu/>
                    <main className="col-md-9 ms-sm-auto col-lg-10">
                        {props.children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UI;
