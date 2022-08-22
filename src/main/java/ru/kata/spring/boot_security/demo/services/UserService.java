package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> index();

    User show(int id);

    void save(User user, String[] roles, String pass);

    void save(User user);

    void update(User user, String[] roles);

    void update(User user);

    void delete(int id);

    User findByName(String name);
}
