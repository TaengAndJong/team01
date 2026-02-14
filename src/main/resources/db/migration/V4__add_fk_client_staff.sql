ALTER TABLE client
    ADD CONSTRAINT fk_client_staffId
        FOREIGN KEY (staffId)
            REFERENCES staff(staffId);
