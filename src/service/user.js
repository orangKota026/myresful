/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [role]
 * @property {string} [title]
 */

class User
{
  /**
   * Check if the user is authenticated.
   * @returns {string | null} The access token if authenticated, otherwise null.
   */
  static isAuthenticated()
  {
    return localStorage.getItem('access_token');
  }

  /**
   * Get the user object from local storage.
   * @returns {User | null} The user object if available, otherwise null.
   */
  static get()
  {
    try
    {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (err)
    {
      console.warn('Failed to parse user from localStorage', err);
      return null;
    }
  }

  /**
   * Get the roles of the user.
   * @returns {string[]} An array of user roles.
   */
  static getRoles()
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
  }

  /**
   * Check if the user has one of the specified roles.
   * @param {string | string[]} role - A role or an array of roles to check.
   * @returns {boolean} True if the user has one of the roles, otherwise false.
   */
  static hasRoles(role)
  {
    const roles = Array.isArray(role) ? role : [role];
    return User.getRoles().some((r) => roles.includes(r));
  }

  /**
   * Logout the user and redirect to a specified path or login page.
   * @param {string} [path='/login'] - The path to redirect to after logout.
   */
  static logout(path = 'login')
  {
    localStorage.clear();
    document.location = path ? `/#/${path}` : '/#/login';
  }
}

export default User;
