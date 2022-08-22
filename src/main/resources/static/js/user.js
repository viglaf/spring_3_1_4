$(async function () {
    await getTableWithLogedInUserInfo();
})

const userFetchService = {
    findLogedUser: async () => await fetch('api/userInfo'),
}

async function getTableWithLogedInUserInfo() {
    let table = $('#tableWithLogedInUserInfo tbody');
    table.empty();

    let preuser = await userFetchService.findLogedUser();
    let user = preuser.json();

    user.then(user => {
        let rolesList = "";
        user.roles.forEach((role) => {
                rolesList += role.name.slice(5) + "  ";
            }
        )
        let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${rolesList}</td>

                        </tr>
                )`;
        table.append(tableFilling);
    })
}
