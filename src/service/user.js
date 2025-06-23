/** @typedef {import('../../types').UserData} UserData */

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
   * @returns {UserData | null}
   */
  static get()
  {
    try
    {
      const user = localStorage.getItem('user');
      return user ? /** @type {UserData} */ (JSON.parse(user)) : null;
    } catch (err)
    {
      console.warn('Failed to parse user from localStorage', err);
      return null;
    }
  }

  /**
   * Get the roles of the user.
   * @returns {string[]}
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
   * @param {string | string[]} role
   * @returns {boolean}
   */
  static hasRoles(role)
  {
    const roles = Array.isArray(role) ? role : [role];
    return User.getRoles().some((r) => roles.includes(r));
  }

  /**
   * Logout the user and redirect to a specified path or login page.
   * @param {string} [path] - The path to redirect to after logout.
   */
  static logout(path = 'login')
  {
    localStorage.clear();
    window.location.href = `/#/${path}`;
  }
}

export default User;
