package com.flywire.exercise.service;

import com.flywire.exercise.model.Employee;

import java.io.IOException;
import java.util.*;

public interface IEmployeeService {
    List<Employee> getActiveList() throws IOException;
    Map<String, Object> getListByIdWithDirectReports(String id) throws IOException;
    List<Employee> getListHiredWithinRange(Date startDate, Date endDate) throws IOException;
    Employee create(Employee employeeItem) throws IOException;
    Employee deactivate(String id) throws IOException;
}
