export const login = (username, password) => {
  return (dispatch) => {
    // make the actual call
    const user = {
      username: 'user01',
      firstName: 'User',
      lastName: '01',
      location: 'Planet Earth',
      githubLink: 'https://github.com',
      personalPage: 'https://duckduckgo.com',
      clubLeader: true
    }
    return confirmLogin(dispatch, user);
  }
};

export const logout = () => {
  return (dispatch) => {
    // make the actual call
  }
}

export const checkLogin = () => {
  return (dispatch) => {
    // make the actual call
  }
}

const confirmLogin = (dispatch, user) => {
  return dispatch({
    type: 'USER_LOGIN',
    payload: {
      ...user
    }
  })
}
