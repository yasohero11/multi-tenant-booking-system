<?php

namespace Modules\Teams\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToTenant;

class Team extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
    ];

    public function tenant()
    {
        return $this->belongsTo(\Modules\Tenants\App\Models\Tenant::class);
    }

    public function availabilities()
    {
        return $this->hasMany(\Modules\Availability\App\Models\TeamAvailability::class);
    }

    public function bookings()
    {
        return $this->hasMany(\Modules\Bookings\App\Models\Booking::class);
    }
}
