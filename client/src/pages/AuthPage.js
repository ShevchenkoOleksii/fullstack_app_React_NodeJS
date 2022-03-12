import React, {useEffect, useState, useContext} from "react"
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)

    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            // message(data.message)
            auth.login(data.token, data.userId)
            message(data.message)
        } catch (e) {}
    }

    return (
        <div className={'row'}>
            <div className="col s6 offset-s3">
                <h1>Change the Link</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authentication</span>
                        <div>
                            <div className="input-field">

                                <input
                                       id="email"
                                       type="email"
                                       name={'email'}
                                       className={'yellow-input'}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                       id="password"
                                       type="password"
                                       name={'password'}
                                       className={'yellow-input'}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className={'btn yellow darken-4'}
                            onClick={loginHandler}
                            style={{marginRight: 10}}
                            disabled={loading}
                        >
                            Log In
                        </button>
                        <button
                            className={'btn grey lighten-1 black-text'}
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sing In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}