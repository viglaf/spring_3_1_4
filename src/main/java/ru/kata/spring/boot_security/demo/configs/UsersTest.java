//package ru.kata.spring.boot_security.demo.configs;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import ru.kata.spring.boot_security.demo.models.Role;
//import ru.kata.spring.boot_security.demo.models.User;
//import ru.kata.spring.boot_security.demo.services.RoleService;
//import ru.kata.spring.boot_security.demo.services.UserService;
//
//import javax.annotation.PostConstruct;
//
//@Component
//public class UsersTest {
//    private final UserService userService;
//    private final RoleService roleService;
//
//    @Autowired
//    public UsersTest(UserService userService, RoleService roleService) {
//        this.userService = userService;
//        this.roleService = roleService;
//    }
//
//    @PostConstruct
//    private void createTestUsers() {
//        roleService.save(new Role("ROLE_ADMIN"));
//        roleService.save(new Role("ROLE_USER"));
//
//        String[] adminRoles = {"ROLE_ADMIN", "ROLE_USER"};
//
//        userService.save(new User("admin", "admin", "admin@mail.com"), adminRoles, "admin");
//
//        String[] userRoles = {"ROLE_USER"};
//
//        userService.save(new User("user", "user", "user@mail.com"), userRoles, "user");
//    }
//}
