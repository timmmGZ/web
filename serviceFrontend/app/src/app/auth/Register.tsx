import React, {SyntheticEvent, useState} from 'react';

const Register = (props: { setAuthBoard: (authBoard: JSX.Element) => void }) => {
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    //prevent multiple submit
    let submitDisable = false;
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!submitDisable) {
            submitDisable = true;
            await fetch('/api/register/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "name": name,
                    "account": account,
                    "password": password
                })
            }).then(async response => {
                const data = await response.json();
                if (response.status === 201) {
                    props.setAuthBoard(<div/>)
                } else {
                    submitDisable = false;
                    window.confirm(JSON.stringify(data))
                }
            }).catch(e => {
                submitDisable = false;
                window.confirm('Server error, try again later.')
            })
        }
    }
    return (<form className="auth-signUp" onSubmit={submit}>
            <div className="form-group">
                <h2>Sign Up</h2>
                <input type="account" className="form-control" placeholder="Account" required
                       onChange={e => setAccount(e.target.value)}/>
                <input type="password" className="form-control" placeholder="Password" required
                       onChange={e => setPassword(e.target.value)}/>
                <input className="form-control" placeholder="Name" required
                       onChange={e => setName(e.target.value)}/>
                <div className="buttons d-flex gap-3">
                    <button type="submit">Confirm</button>
                    <button onClick={e => props.setAuthBoard(<div/>)}>Back</button>
                </div>
            </div>
        </form>

    );
};

export default Register;
