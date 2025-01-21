class User { };

User.isAuthenticated = () =>
{
  return localStorage.getItem('access_token');
}

User.get = () =>
{
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
}

User.getRoles = () =>
{
  const user = User.get();
  const roles = [];

  if (user.role)
  {
    roles.push(user.role)
  }

  if (user.title)
  {
    roles.push(user.title)
  }

  return roles;
}

User.hasRoles = (role) =>
{
  const roles = role && Array.isArray(role) ? role : [role];
  return User.getRoles().some((el) => roles.some(r => el === r));
}

User.logout = (path) =>
{
  localStorage.clear();
  document.location = path ? "/#/" + path : "/#/login";
}

export default User;
