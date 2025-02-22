class User { }

/**
 * Check if the user is authenticated.
 * @returns {string | null} The access token if authenticated, otherwise null.
 */
User.isAuthenticated = () =>
{
  return localStorage.getItem('access_token');
};

/**
 * Get the user object from local storage.
 * @returns {Object | null} The user object if available, otherwise null.
 */
User.get = () =>
{
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get the roles of the user.
 * @returns {string[]} An array of user roles.
 */
User.getRoles = () =>
{
  const user = User.get();
  const roles = [];

  if (user?.role)
  {
    roles.push(user.role);
  }

  if (user?.title)
  {
    roles.push(user.title);
  }

  return roles;
};

/**
 * Check if the user has one of the specified roles.
 * @param {string | string[]} role - A role or an array of roles to check.
 * @returns {boolean} True if the user has one of the roles, otherwise false.
 */
User.hasRoles = (role) =>
{
  const roles = Array.isArray(role) ? role : [role];
  return User.getRoles().some((el) => roles.includes(el));
};

/**
 * Logout the user and redirect to a specified path or login page.
 * @param {string} [path] - The path to redirect to after logout.
 */
User.logout = (path) =>
{
  localStorage.clear();
  document.location = path ? `/#/${path}` : '/#/login';
};

export default User;
