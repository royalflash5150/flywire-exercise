package com.flywire.exercise.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flywire.exercise.model.Employee;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public  class DataBaseUtil {
    public static List<Employee> fetchEmployees() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        objectMapper.setDateFormat(df);
        InputStream inputStream = new ClassPathResource("json/data.json").getInputStream();
        return new ArrayList<>(Arrays.asList(objectMapper.readValue(inputStream, Employee[].class)));
    }

    public static Employee create(Employee employeeItem) throws IOException{
        List<Employee> employeeList = new ArrayList<>(DataBaseUtil.fetchEmployees());
        employeeList.add(employeeItem);
        ObjectMapper objectMapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        objectMapper.setDateFormat(df);
        File file = new ClassPathResource("json/data.json").getFile();
        objectMapper.writeValue(file, employeeList);
        return employeeItem;
    }
    public static Employee deactivate(String id) throws IOException {
        List<Employee> employeeList = new ArrayList<>(DataBaseUtil.fetchEmployees());
        Employee employeeItem = employeeList.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
        if (employeeItem != null) {
            employeeItem.setActive(false);
            ObjectMapper objectMapper = new ObjectMapper();
            DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
            objectMapper.setDateFormat(df);
            File file = new ClassPathResource("json/data.json").getFile();
            objectMapper.writeValue(file, employeeList);
        }
        return employeeItem;
    }
}
