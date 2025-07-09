<?php

namespace Modules\Users\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\BelongsToTenant;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
    ];

    public function tenant()
    {
        return $this->belongsTo(\Modules\Tenants\App\Models\Tenant::class);
    }

    public function bookings()
    {
        return $this->hasMany(\Modules\Bookings\App\Models\Booking::class);
    }

    public function teams()
    {
        return $this->hasMany(\Modules\Teams\App\Models\Team::class);
    }
}
