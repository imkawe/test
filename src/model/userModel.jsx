class UserModel {
    constructor(user) {
      this.name = user.name || '';
      this.email = user.email || '';
      this.password = user.password || '';
    }
  }
  export default UserModel;