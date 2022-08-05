package com.example.demo;

import com.example.demo.utils.Utils;
import java.security.NoSuchAlgorithmException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void test() throws NoSuchAlgorithmException {
		System.out.println(Utils.hashString("Cisco@11"));
		System.out.println(Utils.hashString("Cisco@11"));
		System.out.println(Utils.hashString("Cisco@11"));
	}

}
