// import React, {useContext, useState} from 'react'
// import {NavLink, useLocation, useHistory} from 'react-router-dom'
// import {Container, Form, Card, Button, Row} from 'react-bootstrap'
// import {observer} from 'mobx-react-lite'
//
// import {ROUTES} from '../constants'
//
//
// import {login, registration} from '../http'
// import {Context} from "../index";
//
// const AuthenticationPage = observer(() => {
//     const {user} = useContext(Context)
//     const location = useLocation()
//     const history = useHistory()
//     const isLogin = location.pathname === ROUTES.LOGIN
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//
//     const click = async () => {
//         try {
//             let data;
//             if (isLogin) {
//                 data = await login(email, password);
//             } else {
//                 data = await registration(email, password);
//             }
//             user.setUser(user)
//             user.setIsAuth(true)
//             history.push(ROUTES.DICTIONARIES)
//         } catch (e) {
//             alert(e.response.data.message)
//         }
//
//     }
//
//     return (
//         <Container
//             className="d-flex justify-content-center align-items-center"
//             style={{height: window.innerHeight - 54}}
//         >
//             <Card style={{width: 600}} className="p-5">
//                 <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
//                 <Form className="d-flex flex-column">
//                     <Form.Control
//                         className="mt-3"
//                         placeholder="Введите ваш email..."
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                     />
//                     <Form.Control
//                         className="mt-3"
//                         placeholder="Введите ваш пароль..."
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                         type="password"
//                     />
//                     <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
//                         {isLogin ?
//                             <div>
//                                 Нет аккаунта? <NavLink to={ROUTES.REGISTRATION}>Зарегистрируйся!</NavLink>
//                             </div>
//                             :
//                             <div>
//                                 Есть аккаунт? <NavLink to={ROUTES.LOGIN}>Войдите!</NavLink>
//                             </div>
//                         }
//                         <Button
//                             variant={"outline-success"}
//                             onClick={click}
//                         >
//                             {isLogin ? 'Войти' : 'Регистрация'}
//                         </Button>
//                     </Row>
//
//                 </Form>
//             </Card>
//         </Container>
//     );
// });
//
// export default AuthenticationPage;
