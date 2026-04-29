# COVID Eligibility WireMock Files

| NHS Number | Test User | Age | Suggested File | Reason |
|---|---|---|---|---|
| 9686368906 | test01 | 83 | `eligible-aged-75-and-over` | Age 75+ | done
| 9658218881 | test04 | 104 | `appointment-booked-nbs` | Age 75+ | done
| 9658218903 | test05 | 77 | `appointment-booked-not-nbs` | Age 75+ | done
| 9658218997 | test07 | 80 | `eligible-aged-75-and-over` | Age 75+ | done
| 9658219004 | test08 | 86 | `empty-response` | Age 75+ | done
| 9658219012 | test09 | 100 | `eligible-aged-75-and-over` | Age 75+ | done
| 9658218989 | test06 | 107 | `already-vaccinated` | Age 75+ | done
| 9686368973 | test | 78 | `eligible-aged-75-and-over` | Age 75+ | done
| 9686369120 | test_p5 | — | `eligible-aged-75-and-over` | RSV age-eligible, assumed 75+ | done 
| 9735548852 | test21 | 75 | `eligible-aged-75-and-over-care-home` | Age 75+ | done
| 9658218873 | test03 | 98 | `eligible-aged-75-and-over-care-home-weak-immune` | Elderly + care home | done Non-aligned
| 9735548844 | test22 | 75 | `eligible-aged-75-and-over-weak-immune` | Age 75+, adds scenario variety | done Non-aligned
| 9658220142 | test11 | 26 | `eligible-aged-75-and-over` | Under 75, clinical risk pathway | done
| 9658220150 | test12 | 61 | `eligible-care-home` | Under 75, no clinical risk | done
| 9450114080 | test13 | 22 | `eligible-weak-immune` | Under 75, no clinical risk | done Non-aligned
| 9466447939 | test14 | 24 | `already-vaccinated` | Under 75, no clinical risk | done
| 9657933617 | test15 | 23 | `eligible-care-home-weak-immune` | Under 75, no clinical risk | done Non-aligned
| 9461135831 | test34 | 14 | `not-eligible` | 12–16 age range | done 
| 9661033498 | test20 | 33 | `eligible-aged-75-and-over` | Under 75, no clinical risk | done
| 9800878378 | test16 | 19 | **HTTP 400** | Bad request scenario |
| 9661033404 | test17 | 41 | **HTTP 404** | Not found scenario |
| 9451019030 | test18 | 26 | **HTTP 422** | Validation error scenario |
| 9436793375 | test19 | 65 | **HTTP 500** | Internal server error scenario |

# Prototype Scenarios

| Scenario | Test User | NHS Number
| eligible-aged-75-and-over | test01 | 9686368906 |
| eligible-aged-75-and-over-weak-immune | test22 |9735548844 |
| eligible-aged-75-and-over-weak-immune-care-home | test03 | 9658218873 |
| eligible-aged-75-and-over-care-home | test21 | 9735548852 |
| eligible-care-home-weak-immune | test15 | 9657933617 |
| eligible-care-home | test12 | 9658220150 | 
| eligible-weak-immune | test13 | 9450114080 |
| not-eligible | test34 | 9461135831 |
| already-vaccinated | test06 | 9658218989 |
| appointment-booked-nbs | test04 | 9658218881 |
| appointment-booked-not-nbs | test05 | 9658218903 |