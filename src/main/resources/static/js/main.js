$(async function () {
    await getTableWithUsers();
    await getTableWithLogedInAdminInfo();
    getDefaultModal();
    addNewUser();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch('api/users'),
    findLogedUser: async () => await fetch('api/userInfo'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
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
                               
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');


    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
            <label for="id"><b>ID</b></label>
            <input type="text" class="form-control form-control-sm" id="id" name="id" value="${user.id}" disabled>
            
            <label for="name"><b>First name</b></label>
            <input class="form-control" type="text" id="name" value="${user.name}">
            
            <label for="lastName"><b>Last name</b></label>
            <input class="form-control" type="text" id="lastName" value="${user.lastName}">
            
            <label for="email"><b>Email</b></label>
            <input class="form-control" type="email" id="email" value="${user.email}">
            
            <label for="pasword"><b>Password</b></label>
            <input class="form-control" type="password" id="password">
                
            <label for="roles" class="font-weight-bold">Role </label>
            <select class="form-control" name="rolesList" id="roles" size="2" multiple>
            <option value="ROLE_ADMIN">ADMIN</option>
            <option value="ROLE_USER">USER</option>
            </select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        const selected_options = document.querySelector('#roles').selectedOptions;
        let rolesNamesArray = new Array(selected_options.length);
        for (let i = 0; i < selected_options.length; i++) {
            rolesNamesArray.push(selected_options[i].value);
        }
        let rolesNames = rolesNamesArray.join("!");
        let data = {
            id: id,
            name: name,
            lastName: lastName,
            email: email,
            password: password,
            rolesNames: rolesNames
        }
        await userFetchService.updateUser(data, id);
        await getTableWithUsers();
        modal.modal('hide');

    })
}



// удаляем юзера из модалки удаления
async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Delete user');


    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
            <label for="id"><b>ID</b></label>
            <input type="text" class="form-control form-control-sm" id="id" name="id" value="${user.id}" disabled>
            
            <label for="name"><b>First name</b></label>
            <input class="form-control" type="text" id="name" value="${user.name}" disabled>
            
            <label for="lastName"><b>Last name</b></label>
            <input class="form-control" type="text" id="lastName" value="${user.lastName}" disabled>
            
            <label for="email"><b>Email</b></label>
            <input class="form-control" type="email" id="email" value="${user.email}" disabled>
                
            <label for="roles" class="font-weight-bold">Role </label>
            <select class="form-control" name="rolesList" id="roles" size="2" multiple disabled>
            <option value="ROLE_ADMIN">ADMIN</option>
            <option value="ROLE_USER">USER</option>
            </select>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        getTableWithUsers();
        modal.modal('hide');
    })


}

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let name = addUserForm.find("#AddNewUserName").val().trim();
        let lastName = addUserForm.find("#AddNewUserLastName").val().trim();
        let email = addUserForm.find("#AddNewUserEmail").val().trim();
        let password = addUserForm.find("#AddNewUserPassword").val().trim();
        const selected_options = document.querySelector('#AddNewUserRoles').selectedOptions;
        let rolesNamesArray = new Array(selected_options.length);
        for (let i = 0; i < selected_options.length; i++) {
            rolesNamesArray.push(selected_options[i].value);
        }
        let rolesNames = rolesNamesArray.join("!");
        let data = {
            name: name,
            lastName: lastName,
            email: email,
            password: password,
            rolesNames: rolesNames
        }
        await userFetchService.addNewUser(data);
        getTableWithUsers();

        fetch("http://localhost:8080/api/users").then(
            res => {
                res.json().then(
                    data => {
                        console.log(data);
                        if (data.length > 0) {
                            let temp = "";

                            data.forEach((u) => {
                                temp += "<tr>";
                                temp += "<td>" + u.id + "</td>";
                                temp += "<td>" + u.name + "</td>";
                                temp += "<td>" + u.lastName + "</td>";
                                temp += "<td>" + u.email + "</td>";
                                var rolesList = "";
                                u.roles.forEach((r) => {
                                        rolesList += r.name.slice(5) + " ";
                                    }
                                )
                                temp += "<td>" + rolesList + "</td></tr>";

                            })

                            document.getElementById("data").innerHTML = temp;
                        }
                    }
                )
            }
        )
    })
}

async function getTableWithLogedInAdminInfo() {
    let table = $('#tableWithLogedInAdminInfo tbody');
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

