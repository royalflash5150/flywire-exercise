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
@CrossOrigin
public class EmployeeController {
    private static final Logger log = LoggerFactory.getLogger(HelloWorldController.class);

    @Autowired
    IEmployeeService iEmployeeService;

    @RequestMapping(value = "/list/active", method = { RequestMethod.GET })
    public ResponseEntity<List<Employee>> getActiveList() {
        try {
            return ResponseEntity.of(java.util.Optional.ofNullable(iEmployeeService.getActiveList()));
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<Map<String, Object>> getListByIdWithDirectReports(@PathVariable String id) {
        if(id == null){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
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
        if(startDate == null || endDate == null ) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        try {
            return ResponseEntity.of(java.util.Optional.ofNullable(iEmployeeService.getListHiredWithinRange(startDate, endDate)));
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Employee> create(@RequestBody Employee employeeItem) {
        if(employeeItem == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        try {
            return ResponseEntity.ok(iEmployeeService.create(employeeItem));
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<Employee> deactivate(@PathVariable String id) {
        if(id == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        try {
            Employee employeeItem = iEmployeeService.deactivate(id);
            if(employeeItem != null) {
                return ResponseEntity.ok(employeeItem);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
