let users = [];
const trimStr = (str) => str.trim().toLowerCase();

const findUser = (user) => {
    const userName = trimStr(user.name);
    const userRoom = trimStr(user.room);

    return users.find(
        (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
    );
}

const addUser = (user) => {
    const isExist = findUser(user);
    !isExist && users.push(user);
    const currentUser = isExist || user;

    return {isExist: !!isExist, user: currentUser};
};

const getCountUsers = (room) => {
    return users.filter((u) => room === u.room)
}

const removeUser = (user) => {
    const currentUser = findUser(user)
    if (findUser(user)) {
        users = users.filter(({ room, name}) => room === currentUser.room && name !== currentUser.name )
    }
}

module.exports = { addUser, findUser, getCountUsers, removeUser };