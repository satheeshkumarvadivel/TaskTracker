package com.example.demo.filters;

import com.example.demo.dao.UserInfoDao;
import com.example.demo.entities.UserInfo;
import java.io.IOException;
import java.util.Map;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerMapping;

@WebFilter("/api")
public class ApiAuthFilter implements Filter {

    Logger log = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired
    UserInfoDao userInfoDao;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String uri = req.getRequestURI();
        log.info(req.getMethod() + " " + uri);
        if (uri.startsWith("/api/v1/users/signin") || uri.startsWith("/api/v1/users/signup")) {
            chain.doFilter(request, response);
        } else {
            boolean loginSuccess = false;
            String token = req.getHeader("Authorization");
            if (token != null) {
                token = token.split(" ")[1];
                UserInfo user = userInfoDao.findByToken(token);
                if (user != null) {
                    if (user.getTokenExpiryTime() - (System.currentTimeMillis() / 1000) > 0) {
                        loginSuccess = true;
                        request.setAttribute("user", user);
                        Map pathVariables = (Map) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
                        if (pathVariables.get("userId") != null) {
                            try {
                                if (user.getId() != (Integer) pathVariables.get("userId")) {
                                    log.info("Unauthorized access.");
                                    res.setContentType("application/json");
                                    res.sendError(403, "Forbidden");
                                }
                            } catch (Exception e) {
                                log.info("Error: ", e);
                                res.setContentType("application/json");
                                res.sendError(403, "Forbidden");
                            }
                        }
                        chain.doFilter(request, response);
                    } else {
                        log.info("Token expired!");
                    }
                } else {
                    log.info("User with token not found.");
                }
            }
            if (!loginSuccess) {
                log.info("Login Failed!");
                res.setContentType("application/json");
                res.sendError(401, "Unauthorized");
            }
        }
    }
}
