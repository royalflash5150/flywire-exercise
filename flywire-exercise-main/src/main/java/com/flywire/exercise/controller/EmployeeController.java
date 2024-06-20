package com.flywire.exercise.controller;

import com.flywire.exercise.HelloWorldController;
import com.flywire.exercise.model.Employee;
import com.flywire.exercise.service.IEmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/employee")
public class EmployeeController {
    private static final Logger log = LoggerFactory.getLogger(HelloWorldController.class);

    @Autowired
    IEmployeeService iEmployeeService;

    @RequestMapping(value = "/list/active", method = { RequestMethod.GET })
    public ResponseEntity<List<Employee>> getActiveList()
    {
        try {
            return ResponseEntity.of(java.util.Optional.ofNullable(iEmployeeService.getActiveList()));
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<Map<String, Object>> getListByIdWithDirectReports(@PathVariable String id) {
        try {
            Map<String, Object> result = iEmployeeService.getListByIdWithDirectReports(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list/hired")
    public ResponseEntity<List<Employee>> getListHiredWithinRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<Employee> create(@RequestBody Employee employeeItem) {
        return null;
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<Employee> deactivate(@PathVariable String id) {
        return null;
    }
}
