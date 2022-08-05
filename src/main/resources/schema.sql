CREATE TABLE userinfo (
    id INT NOT NULL AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    emailid VARCHAR(100) NOT NULL UNIQUE,
    manager_emailid VARCHAR(100),
    is_manager VARCHAR(1),
    password VARCHAR(255),
    is_active VARCHAR(1),
    created_time VARCHAR(10),
    token VARCHAR(255),
    token_expiry_time VARCHAR(10),
    salt VARCHAR(6),
    PRIMARY KEY (id)
);

CREATE TABLE taskgroup (
    id INT NOT NULL AUTO_INCREMENT,
    group_name VARCHAR(150) UNIQUE,
    group_owner_id INT REFERENCES userinfo(id),
    is_active VARCHAR(1),
    last_updated_time VARCHAR(10),
    PRIMARY KEY(id),
    FOREIGN KEY (group_owner_id) REFERENCES userinfo(id)
);

CREATE TABLE task (
    id INT NOT NULL AUTO_INCREMENT,
    task_detail VARCHAR(250),
    userinfo_id INT,
    taskgroup_id INT,
    created_date DATE,
    created_time VARCHAR(10),
    last_updated_time VARCHAR(10),
    PRIMARY KEY(id),
    FOREIGN KEY (userinfo_id) REFERENCES userinfo(id),
    FOREIGN KEY (taskgroup_id) REFERENCES taskgroup(id)
);
