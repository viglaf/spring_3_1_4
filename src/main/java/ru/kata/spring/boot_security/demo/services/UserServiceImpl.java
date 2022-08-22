package ru.kata.spring.boot_security.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public List<User> index() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User show(int id) {
        return userRepository.getById(id);
    }

    @Override
    @Transactional
    public void save(User user, String[] roles, String password) {
        user.setPassword(passwordEncoder.encode(password));

        user.setRoles(Arrays.stream(roles)
                .map(roleService::findByName)
                .collect(Collectors.toSet()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRoles(Arrays.stream(user.getRolesNames().split("!"))
                .map(roleService::findByName)
                .collect(Collectors.toSet()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void update(User user, String[] roles) {
        User userToBeUpdated = userRepository.getById(user.getId());

        if (user.getPassword().equals("")) {
            user.setPassword(userToBeUpdated.getPassword());
        } else{
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setRoles(Arrays.stream(roles)
                .map(roleService::findByName)
                .collect(Collectors.toSet()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void update(User user) {
        User userToBeUpdated = userRepository.getById(user.getId());

        if (user.getPassword().equals("")) {
            user.setPassword(userToBeUpdated.getPassword());
        } else{
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setRoles(Arrays.stream(user.getRolesNames().split("!"))
                .map(roleService::findByName)
                .collect(Collectors.toSet()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void delete(int id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public User findByName(String name) {
        return userRepository.findByName(name);
    }
}
