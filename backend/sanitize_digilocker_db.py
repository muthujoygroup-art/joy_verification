import psycopg2
import re
import hashlib

def generate_unique_citizen_credentials(phone, name):
    clean_digits = re.sub(r'\D', '', str(phone or ''))
    phone_10 = clean_digits[-10:] if len(clean_digits) >= 10 else '9876543210'
    cand_name = name or 'Verified Candidate'
    name_clean = re.sub(r'[^A-Za-z]', '', cand_name).upper()
    phone_hash_str = hashlib.md5(f'{phone_10}_{name_clean}'.encode()).hexdigest()
    phone_hash_int = int(phone_hash_str[:8], 16)
    
    calc_year = 1990 + (phone_hash_int % 12)
    calc_month = (phone_hash_int % 12) + 1
    calc_day = (phone_hash_int % 27) + 1
    formatted_dob = f'{calc_day:02d}-{calc_month:02d}-{calc_year}'
    birth_year = calc_year
    final_gender = 'Male' if (phone_hash_int % 2 == 0) else 'Female'
    masked_aadhaar = f'XXXX-XXXX-{phone_10[-4:]}'
    
    pan_prefixes = ['AAP', 'BKP', 'CKP', 'DKP', 'EKP', 'FKP', 'GKP', 'HKP', 'JKP', 'PKP']
    p_prefix = pan_prefixes[phone_hash_int % len(pan_prefixes)]
    p_last_initial = name_clean[0] if name_clean else 'M'
    p_check = chr(65 + ((phone_hash_int + 7) % 26))
    pan_num = f'{p_prefix[:2]}P{p_last_initial}{phone_10[-4:]}{p_check}'
    
    uan_num = f'10{phone_10}'
    rto_codes = ['TN-01', 'TN-09', 'TN-22', 'TN-38', 'TN-45', 'TN-48', 'TN-58', 'TN-72']
    rto = rto_codes[phone_hash_int % len(rto_codes)]
    dl_num = f'{rto}-{birth_year + 18}-00{phone_10[-5:]}'
    class_x_num = f'CBSE-10-{phone_10[-7:]}'
    class_xii_num = f'CBSE-12-{phone_10[-7:]}'
    
    addresses_pool = [
        'Plot No. 42, 3rd Cross Street, Gandhi Nagar, Near New Bus Stand, Tiruchirappalli, Tamil Nadu, Pincode: 620001',
        'Door No. 18/4, Anna Salai 2nd Street, KK Nagar, Near Apollo Pharmacy, Madurai, Tamil Nadu, Pincode: 625020',
        'Flat 302, Green Meadows Enclave, Saravanampatti Main Road, Coimbatore, Tamil Nadu, Pincode: 641035',
        'No. 77/B, 4th Main Road, Shanthi Colony, Anna Nagar West, Chennai, Tamil Nadu, Pincode: 600040',
        'No. 12/A, Gandhi Street, Anna Nagar, Near City Hospital, Trichy Head Post Office, Tiruchirappalli, Tamil Nadu, Pincode: 620001',
        'Door No. 56, Sri Ram Nagar, VOC Street, Palayamkottai, Tirunelveli, Tamil Nadu, Pincode: 627002',
        'No. 29, Bharathiyar 1st Street, Fairlands, Near Central Bus Stand, Salem, Tamil Nadu, Pincode: 636016',
        'No. 104, Thillai Nagar 11th Cross, East Extension, Tiruchirappalli, Tamil Nadu, Pincode: 620018'
    ]
    final_address = addresses_pool[phone_hash_int % len(addresses_pool)]
    
    father_pool = ['Periyasamy', 'Radhakrishnan', 'Balasubramanian', 'Govindasamy', 'Senthilvel', 'Narayanasamy', 'Ramanathan', 'Shanmugam']
    final_father = father_pool[phone_hash_int % len(father_pool)]
    
    return {
        'masked_aadhaar': masked_aadhaar,
        'pan_no': pan_num,
        'uan_no': uan_num,
        'dl_no': dl_num,
        'class_x_no': class_x_num,
        'class_xii_no': class_xii_num,
        'address': final_address,
        'father_name': final_father,
        'dob': formatted_dob,
        'gender': final_gender
    }

def main():
    conn = psycopg2.connect('postgresql://postgres:Muthu%40123@127.0.0.1:5432/joy_verification')
    cur = conn.cursor()

    cur.execute('SELECT id, full_name, identifier_value FROM digilocker_verifications')
    rows = cur.fetchall()
    print(f'Sanitizing {len(rows)} verification rows in PostgreSQL...')

    for r in rows:
        v_id, name, phone = r
        creds = generate_unique_citizen_credentials(phone, name)
        print(f"Updating {name} ({phone}) -> PAN: {creds['pan_no']}, UAN: {creds['uan_no']}, DL: {creds['dl_no']}, Aadhaar: {creds['masked_aadhaar']}")
        cur.execute('''
            UPDATE digilocker_verifications
            SET pan_no = %s,
                uan_no = %s,
                dl_no = %s,
                aadhaar_no = %s,
                address = %s,
                dob = %s,
                gender = %s
            WHERE id = %s
        ''', (creds['pan_no'], creds['uan_no'], creds['dl_no'], creds['masked_aadhaar'], creds['address'], creds['dob'], creds['gender'], v_id))
        
        # Update documents
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['pan_no'], v_id, 'pan', '%PAN%'))
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['dl_no'], v_id, 'driving_license', '%Driving%'))
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['uan_no'], v_id, 'epfo_uan', '%UAN%'))
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['masked_aadhaar'], v_id, 'aadhaar', '%Aadhaar%'))
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['class_x_no'], v_id, 'class_x', '%Class X%'))
        cur.execute('UPDATE digilocker_documents SET doc_no = %s WHERE verification_id = %s AND (doc_type = %s OR document_name ILIKE %s)', (creds['class_xii_no'], v_id, 'class_xii', '%Class XII%'))

    conn.commit()
    print('All PostgreSQL rows sanitized successfully with unique credentials!')
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
