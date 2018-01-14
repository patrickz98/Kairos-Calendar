# Birthday
password = 00000000
encrypt:
	tar --create --file - --gzip -- Keystore | openssl aes-256-cbc -salt -k $(password) -out Keystore.crypt; \
	rm -rf Keystore;

decrypt:
	openssl aes-256-cbc -d -salt -k $(password) -in Keystore.crypt | tar -v --extract --gzip --file -; \
	rm -rf Keystore.crypt;
