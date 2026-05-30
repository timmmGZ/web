import React, {SyntheticEvent, useState} from 'react';

const Login = (props: { name: string, setName: (name: string) => void, setAuthBoard: (authBoard: JSX.Element) => void, setRedirect: (redirect: boolean) => void }) => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [keepLogin, setKeepLogin] = useState(false);
    //prevent multiple submit
    let submitDisable = false;
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!submitDisable) {
            submitDisable = true;
            await fetch('/api/login/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    "account": account,
                    "password": password,
                    "keepLogin": keepLogin
                })
            }).then(async response => {
                const data = await response.json();
                if (response.status === 200) {
                    props.setName(data.name);
                    props.setRedirect(true)
                } else {
                    submitDisable = false;
                    window.confirm(data['Response'])
                }
            }).catch(e => {
                submitDisable = false;
                window.confirm('Server error, try again later.')
            })
        }
    }
    return (<form className="auth-signIn" onSubmit={submit}>
            <div className="form-group">
                <h2>Sign In</h2>
                <input type="account" className="form-control" placeholder="Account" required
                       onChange={e => setAccount(e.target.value)}/>
                <input type="password" className="form-control" placeholder="Password" required
                       onChange={e => setPassword(e.target.value)}/>
                <label> <input className="checkbox" type="checkbox" checked={keepLogin}
                               onChange={e => setKeepLogin(!keepLogin)}/> Keep Logged in for 1 day?</label>
                <div className="buttons d-flex gap-3">
                    <button type="submit"> Confirm</button>
                    <button onClick={e => props.setAuthBoard(<div/>)}>Back</button>
                </div>
            </div>
        </form>
    );
};

export default Login;
